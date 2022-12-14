import { message, Form, Button } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { sysDictSave, sysDictUpdate } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { getModel } from '@/utils';

export const FREEZE_OPTIONS = [
  { value: 0, label: '正常' },
  { value: 1, label: '冻结' },
];

const handleAdd = async (data: ParamsType) => {
  const hide = message.loading('正在添加');
  try {
    await sysDictSave(data);
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
    await sysDictUpdate(data);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.warn('修改失败请重试！');
    return false;
  }
};

export default function AddModalForm() {
  const { actionRef, visible, editType, edit } = useSelector((state) => state.dictionaryList);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'dictionaryList/setEdit',
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
      <Button
        type="link"
        key="primary"
        onClick={() => {
          dispatch({
            type: 'dictionaryList/setEdit',
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
      <ModalForm
        title={`${getModel(editType)}字典目录`}
        width="400px"
        visible={visible}
        form={form}
        onVisibleChange={(flag) => {
          if (!flag) closeModal();
        }}
        onFinish={async (value) => {
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
          label="编码"
          width="md"
          rules={[{ required: true, message: '请输入编码' }]}
          name="code"
        />
        <ProFormText
          label="名称"
          width="md"
          rules={[{ required: true, message: '请输入名称' }]}
          name="name"
        />
        <ProFormText
          label="描述"
          width="md"
          rules={[{ required: true, message: '请输入描述' }]}
          name="description"
        />
      </ModalForm>
    </>
  );
}
