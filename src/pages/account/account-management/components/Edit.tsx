import { message, Form, Button } from 'antd';
import { ModalForm, ProFormText, ProForm, ProFormSelect, ProFormRadio } from '@ant-design/pro-form';
import { save, systemUser } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useAsyncEffect, useUpdateEffect } from 'ahooks';
import { findByPage as findByPageRoles } from '../../role-management/service';
import { getModel } from '@/utils';

export const STATUS_OPTIONS = [
  { value: true, label: '停用' },
  { value: false, label: '正常' },
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

export default function AddModalForm() {
  const { actionRef, visible, editType, edit } = useSelector((state) => state.accountManagement);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'accountManagement/setEdit',
      payload: {
        edit: undefined,
        editType: undefined,
        visible: false,
      },
    });
  };

  // useUpdateEffect(() => {
  //   if (visible && editType === 2 && edit) {
  //     form.setFieldsValue({ ...edit, roleIds: edit.roles.map((res) => res.roleId) });
  //   } else {
  //     form.resetFields();
  //   }
  // }, [visible, editType, edit]);

  useAsyncEffect(async () => {
    if (visible && editType === 2 && edit) {
      const { data } = await systemUser(edit.userId);
      form.setFieldsValue({
        ...edit,
        roleIds: data.roles.map((res) => res.roleId),
      });
    } else {
      form.resetFields();
    }
  }, [visible, editType, edit]);

  return (
    <>
      <Button
        type="primary"
        key="primary"
        onClick={() => {
          dispatch({
            type: 'accountManagement/setEdit',
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
        title={`${getModel(editType)}用户`}
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
          if (edit?.userId) {
            flag = await handleAdd({ ...edit, ...value });
          } else flag = await handleAdd(value as ParamsType);
          if (flag) {
            closeModal();
            if (actionRef?.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm.Group>
          <ProFormSelect
            name="roleIds"
            label="角色"
            width="sm"
            request={async () => {
              const { data: { records = [] } = { records: [] } } = await findByPageRoles({
                current: 1,
                size: 10000,
              });

              return records;
            }}
            fieldProps={{
              mode: 'multiple',
              fieldNames: {
                label: 'roleName',
                value: 'roleId',
              },
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="nickName"
            label="用户昵称"
            width="sm"
            rules={[{ required: true, message: '必须用户昵称' }]}
          />
          <ProFormText
            name="userName"
            label="用户名称"
            width="sm"
            rules={[{ required: true, message: '必须用户名称' }]}
          />
          <ProFormText.Password
            name="password"
            label="密码"
            width="sm"
            rules={[{ required: true, message: '必须密码' }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText name="phonenumber" label="手机号码" width="sm" />
          <ProFormRadio.Group
            initialValue={0}
            label="状态"
            width="md"
            name="status"
            options={STATUS_OPTIONS}
          />
        </ProForm.Group>
      </ModalForm>
    </>
  );
}
