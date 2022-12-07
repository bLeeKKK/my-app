import { message, Form, Button } from 'antd';
import {
  ModalForm,
  ProFormTextArea,
  ProFormText,
  ProFormDigit,
  ProForm,
  ProFormRadio,
} from '@ant-design/pro-form';
import { insert, update } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';

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

const handleUpdate = async (data: ParamsType) => {
  const hide = message.loading('正在添加');
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
  const { actionRef, visible, editType, edit } = useSelector((state) => state.configList);
  const [form] = Form.useForm();
  const baseType = useWatch('baseType', form);
  const eidtFlag = editType === 2 && edit;
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

  useUpdateEffect(() => {
    if (visible && editType === 2 && edit) {
      form.setFieldsValue(edit);
    }
  }, [visible, editType, edit]);

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
        <ProFormRadio.Group
          rules={[{ required: true, message: '请选择平均时效基数确认类型' }]}
          initialValue={false}
          label="平均时效基数确认类型"
          width="md"
          name="baseType"
          options={BASETYPE_OPTIONS}
        />
        {baseType ? (
          <ProForm.Group>
            <ProFormDigit
              label="上月事件结束平均基数值（秒）"
              width="md"
              min={0}
              rules={[{ required: true, message: '' }]}
              disabled={eidtFlag}
              name="lastMonthEventFinishAverageBaseValue"
            />
            <ProFormDigit
              label="上月纯接口时效平均基数值(毫秒)"
              width="md"
              min={0}
              rules={[{ required: true, message: '' }]}
              disabled={eidtFlag}
              name="lastMonthIntfAgingAverageBaseValue"
            />
            <ProFormDigit
              label="上月整体成功率平均基数值"
              width="md"
              min={0}
              rules={[{ required: true, message: '' }]}
              disabled={eidtFlag}
              name="lastMonthOverallSuccessAverageBaseValue"
            />
          </ProForm.Group>
        ) : (
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
              label="整体成功率平均基数值"
              width="md"
              min={0}
              rules={[{ required: true, message: '整体成功率平均基数值' }]}
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
            disabled={eidtFlag}
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
          disabled={eidtFlag}
        />
      </ModalForm>
    </>
  );
}
