import { message, Form, Button } from 'antd';
import {
  ProFormTextArea,
  ModalForm,
  ProFormRadio,
  ProFormText,
  ProForm,
  ProFormSelect,
} from '@ant-design/pro-form';
import { save, edit as update } from '../service';
import type { ParamsType } from '../data.d';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { getModel } from '@/utils';
// import MyAccess from '@/components/MyAccess';

// const { useWatch } = Form;

export const FREEZE_OPTIONS = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

export const YESORNO_OPTIONS = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

export const SYS_OPTIONS = [
  { value: 'SCMC', label: 'SCMC' },
  { value: 'USO', label: 'USO' },
  { value: 'EBOC', label: 'EBOC' },
  { value: 'LRP', label: 'LRP' },
  { value: 'MOFC', label: 'MOFC' },
  { value: 'R3', label: 'R3' },
  { value: 'TIMC', label: 'TIMC' },
];

export const DB_OPTIONS = [
  { value: 'Mysql', label: 'Mysql' },
  { value: 'SqlServer', label: 'SqlServer' },
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
  const { actionRef, visible, editType, edit } = useSelector(
    (state: any) => state.dfcReconciliationLink,
  );
  const [form] = Form.useForm();
  // const baseType = useWatch('baseType', form);
  // const eidtFlag = editType === 2 && edit;
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'dfcReconciliationLink/setEdit',
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
      {/* <MyAccess aKey="monitor:interface-list:add"> */}
      <Button
        size="small"
        type="primary"
        onClick={() => {
          dispatch({
            type: 'dfcReconciliationLink/setEdit',
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
      {/* </MyAccess> */}
      <ModalForm
        title={`${getModel(editType)}数据源配置`}
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
          } else {
            flag = await handleAdd(value);
          }
          if (flag) {
            closeModal();
            if (actionRef?.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            label="数据源名称"
            rules={[{ required: true, message: '请输入数据源名称' }]}
            width="sm"
            name="sourceName"
          />
          <ProFormText
            label="数据源IP"
            rules={[{ required: true, message: '请输入数据源IP' }]}
            width="sm"
            name="sourceIp"
          />
          <ProFormText
            label="数据源端口"
            rules={[{ required: true, message: '请输入数据源端口' }]}
            width="sm"
            name="sourcePort"
          />
          <ProFormText
            label="数据库名称"
            rules={[{ required: true, message: '请输入数据库名称' }]}
            width="sm"
            name="sourceDbName"
          />
          <ProFormText
            label="数据源用户名"
            rules={[{ required: true, message: '请输入数据源用户名' }]}
            width="sm"
            name="sourceUserName"
          />
          <ProFormText.Password
            label="数据源密码"
            rules={[{ required: true, message: '请输入数据源密码' }]}
            width="sm"
            name="sourcePwd"
          />
          <ProFormSelect
            rules={[{ required: true, message: '请选择数据源类型' }]}
            label="数据源类型"
            width="sm"
            name="sourceType"
            options={DB_OPTIONS}
          />
          <ProFormSelect
            rules={[{ required: true, message: '请选择数据源系统' }]}
            label="数据源系统"
            width="sm"
            name="sourceSystem"
            options={SYS_OPTIONS}
          />
          <ProFormRadio.Group
            rules={[{ required: true, message: '请选择是否原始系统' }]}
            initialValue={false}
            label="是否原始系统"
            width="sm"
            name="sourceFlag"
            options={YESORNO_OPTIONS}
          />
          <ProFormText
            label="视图名"
            rules={[{ required: true, message: '请输入视图名' }]}
            width="sm"
            name="viewName"
          />
          {/* <ProFormRadio.Group */}
          {/*   name="freeze" */}
          {/*   label="状态" */}
          {/*   initialValue={0} */}
          {/*   options={FREEZE_OPTIONS} */}
          {/* /> */}
          <ProFormTextArea width="xl" name="remark" label="备注" placeholder="请输入备注" />
        </ProForm.Group>
      </ModalForm>
    </>
  );
}
