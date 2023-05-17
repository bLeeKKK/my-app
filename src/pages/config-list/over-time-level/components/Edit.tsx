import { message, Form, Button } from 'antd';
import { ModalForm, ProForm, ProFormRadio, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { save, update } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { getModel } from '@/utils';
import { Colorpicker } from 'antd-colorpicker';
import MyAccess from '@/components/MyAccess';

export const FREEZE_OPTIONS = [
  { value: false, label: '正常' },
  { value: true, label: '冻结' },
];
export const NORMAL_OPTIONS = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

const handleAdd = async (data: ParamsType) => {
  const hide = message.loading('正在添加');
  try {
    await save(data);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.warn('添加失败请重试！');
    return false;
  }
};

const handleUpdate = async (data: ParamsType) => {
  const hide = message.loading('正在修改');
  try {
    await update(data);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.warn('添加失败请重试！');
    return false;
  }
};

export default function AddModalForm() {
  const { actionRef, visible, editType, edit } = useSelector((state) => state.overTimeLevel);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'overTimeLevel/setEdit',
      payload: {
        edit: undefined,
        editType: undefined,
        visible: false,
      },
    });
  };

  useUpdateEffect(() => {
    if (visible && editType === 2 && edit) {
      form.setFieldsValue(edit);
    } else {
      form.resetFields();
    }
  }, [visible, editType, edit]);

  return (
    <>
      <MyAccess aKey="config-list:over-time-level:add">
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            dispatch({
              type: 'overTimeLevel/setEdit',
              payload: {
                edit: undefined,
                visible: true,
                editType: 1,
              },
            });
          }}
        >
          <PlusOutlined /> 新建
        </Button>
      </MyAccess>
      <ModalForm
        title={`${getModel(editType)}业务流程配置`}
        width="600px"
        visible={visible}
        form={form}
        onVisibleChange={(flag) => {
          if (!flag) closeModal();
        }}
        onFinish={async (value) => {
          if (value.signColor) value.signColor = value.signColor?.hex;

          let flag = false;
          if (edit?.id) {
            flag = await handleUpdate({ ...edit, ...value });
          } else flag = await handleAdd(value as ParamsType);
          if (flag) {
            closeModal();
            if (actionRef?.current) actionRef.current.reload();
          }
        }}
      >
        <ProForm.Group>
          <ProFormDigit
            rules={[{ required: true, message: '请选择是否正常' }]}
            label="结束范围"
            name="endScope"
            min={0}
            fieldProps={{ precision: 0 }}
          />
          <ProFormDigit
            rules={[{ required: true, message: '请选择是否正常' }]}
            label="开始范围"
            name="startScope"
            min={0}
            fieldProps={{ precision: 0 }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormRadio.Group
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue={false}
            label="状态"
            width="md"
            name="freeze"
            options={FREEZE_OPTIONS}
          />
          <ProFormRadio.Group
            rules={[{ required: true, message: '请选择是否正常' }]}
            name="normal"
            label="是否正常"
            initialValue={true}
            options={NORMAL_OPTIONS}
          />
        </ProForm.Group>
        <Form.Item label="标记颜色" name="signColor">
          <Colorpicker popup />
        </Form.Item>
        <ProFormText
          rules={[{ required: true, message: '请选择超时等级描述' }]}
          label="超时等级描述"
          width="md"
          name="overTimeRemark"
        />
      </ModalForm>
    </>
  );
}
