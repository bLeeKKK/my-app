import { message, Form, Button } from 'antd';
import { ModalForm, ProFormText, ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import { save, update } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { getModel } from '@/utils';
import { findAllByDictCode } from '@/services/dictionary';
import MyAccess from '@/components/MyAccess';

export const FREEZE_OPTIONS = [
  { value: false, label: '正常' },
  { value: true, label: '冻结' },
];
export const FLOW_TYPE = [
  { value: '正向', label: '正向' },
  { value: '逆向', label: '逆向' },
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
  const { actionRef, visible, editType, edit } = useSelector((state) => state.operationFlow);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'operationFlow/setEdit',
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
      <MyAccess aKey="config-list:operation-flow:add">
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            dispatch({
              type: 'operationFlow/setEdit',
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
        width="400px"
        visible={visible}
        form={form}
        onVisibleChange={(flag) => {
          if (!flag) closeModal();
        }}
        onFinish={async (value) => {
          value.flowType = value.flowType === '正向' ? 0 : 1;
          let flag = false;
          if (edit?.id) {
            flag = await handleUpdate({ ...edit, ...value });
          } else flag = await handleAdd(value as ParamsType);
          if (flag) {
            closeModal();
            if (actionRef?.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label="流程编号"
          width="md"
          disabled={edit}
          // rules={[{ required: true, message: '请输入流程编号' }]}
          name="busFlowCode"
        />
        <ProFormText
          label="流程描述"
          width="md"
          rules={[{ required: true, message: '请输入流程描述' }]}
          name="busFlowName"
        />
        <ProFormSelect
          name="sourceSys"
          width="md"
          label="流程系统"
          rules={[{ required: true, message: '请选择流程系统' }]}
          request={async () => {
            const { success, data } = await findAllByDictCode('source_sys');
            if (success) return data.map(({ name: label, value }) => ({ label, value }));
            else return [];
          }}
        />
        <ProFormRadio.Group
          rules={[{ required: true, message: '请选择流程类型' }]}
          // initialValue={0}
          label="流程类型"
          width="md"
          name="flowType"
          options={FLOW_TYPE}
        />
        <ProFormRadio.Group
          rules={[{ required: true, message: '请选择状态' }]}
          // initialValue={0}
          label="状态"
          width="md"
          name="freeze"
          options={FREEZE_OPTIONS}
        />
      </ModalForm>
    </>
  );
}
