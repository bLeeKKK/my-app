import { message, Button, Form } from 'antd';
import {
  ModalForm,
  ProFormTextArea,
  ProFormText,
  ProFormDigit,
  ProForm,
  ProFormRadio,
} from '@ant-design/pro-form';
import { insert } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';

const { useWatch } = Form;
export const BASETYPE_OPTIONS = [
  { value: false, label: '人工确认' },
  { value: true, label: '自动基数' },
];

const handleAdd = async (data: ParamsType) => {
  const hide = message.loading('正在添加');
  try {
    await insert(data);
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
  const { actionRef, visible } = useSelector((state) => state.configList);
  const [form] = Form.useForm();
  const baseType = useWatch('baseType', form);

  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'configList/setEdit',
      payload: {
        edit: undefined,
        editType: undefined,
        visible: false,
      },
    });
  };

  return (
    <>
      <Button
        type="primary"
        key="primary"
        onClick={() => {
          dispatch({
            type: 'configList/setEdit',
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
        title="新建配置"
        width="800px"
        visible={visible}
        // formRef={formRef}
        form={form}
        // labelCol={{ span: 10 }}
        // wrapperCol={{ span: 14 }}
        onVisibleChange={(flag) => {
          if (!flag) closeModal();
        }}
        onFinish={async (value) => {
          const data = await handleAdd(value as ParamsType);
          if (data) {
            closeModal();
            if (actionRef?.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormRadio.Group
          rules={[{ required: true, message: '请选择平均时效基数确认类型' }]}
          initialValue={false}
          label="平均时效基数确认类型"
          width="md"
          name="baseType"
          options={BASETYPE_OPTIONS}
        />
        {baseType ? null : (
          <ProForm.Group>
            <ProFormDigit
              label="事件结束平均基数值（秒）"
              width="md"
              min={0}
              rules={[{ required: true, message: '请输入事件结束平均基数值（秒）' }]}
              name="eventFinishAverageBaseValue"
            />
            <ProFormDigit
              label="纯接口时效平均基数值(毫秒)"
              width="md"
              min={0}
              rules={[{ required: true, message: '请输入纯接口时效平均基数值（毫秒）' }]}
              name="intfAgingAverageBaseValue"
            />
            <ProFormDigit
              label="纯接口时效平均基数值(毫秒)"
              width="md"
              min={0}
              rules={[{ required: true, message: '请输入纯接口时效平均基数值（毫秒)' }]}
              name="overallSuccessAverageBaseValue"
            />
          </ProForm.Group>
        )}
        <ProForm.Group>
          <ProFormText
            label="接口标识"
            rules={[{ required: true, message: '请输入接口标识' }]}
            width="md"
            name="intfTag"
          />
          <ProFormDigit
            label="排序"
            rules={[{ required: true, message: '请输入接口标识' }]}
            width="md"
            min={0}
            name="sort"
          />
        </ProForm.Group>
        <ProFormTextArea
          label="接口描述"
          rules={[{ required: true, message: '请输入接口描述' }]}
          width="xl"
          name="intfDescription"
        />
      </ModalForm>
    </>
  );
}
