import { message, Form, Button } from 'antd';
import {
  ModalForm,
  ProFormTextArea,
  ProFormText,
  ProFormDigit,
  ProForm,
  ProFormRadio,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
import { save } from '../service';
import { treeselect, roleMenuTreeselect } from '../../right-management/service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect, useAsyncEffect } from 'ahooks';
import { getModel } from '@/utils';

export const STATUS_OPTIONS = [
  { value: 0, label: '正常' },
  { value: 1, label: '停用' },
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
  const { actionRef, visible, editType, edit } = useSelector((state) => state.roleManagement);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'roleManagement/setEdit',
      payload: {
        edit: undefined,
        editType: undefined,
        visible: false,
      },
    });
  };

  // useUpdateEffect(() => {
  //   if (visible && editType === 2 && edit) {
  //     form.setFieldsValue(edit);
  //   } else {
  //     form.resetFields();
  //   }
  // }, [visible, editType, edit]);

  useAsyncEffect(async () => {
    if (visible && editType === 2 && edit) {
      const { data } = await roleMenuTreeselect(edit.roleId);
      form.setFieldsValue({
        ...edit,
        menuIds: data?.checkedKeys || [],
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
            type: 'roleManagement/setEdit',
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
        title={`${getModel(editType)}角色`}
        width="600px"
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
          if (edit?.roleId) {
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
        <ProFormTreeSelect
          name="menuIds"
          label="权限配置"
          width="sm"
          placeholder={'请选择权限配置'}
          fieldProps={{
            treeCheckable: true,
            fieldNames: {
              value: 'id',
              label: 'label',
              children: 'children',
            },
          }}
          request={async () => {
            const { data = [] } = await treeselect();

            return data;
          }}
        />
        <ProForm.Group>
          <ProFormText
            name="roleName"
            label="角色名称"
            width="xs"
            rules={[{ required: true, message: '必须角色名称' }]}
          />
          <ProFormText
            name="roleKey"
            label="权限字符"
            width="xs"
            rules={[{ required: true, message: '必须权限字符' }]}
          />
          <ProFormDigit
            name="roleSort"
            label="角色顺序"
            width="xs"
            rules={[{ required: true, message: '必须角色顺序' }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormRadio.Group
            initialValue={0}
            label="状态"
            width="md"
            name="status"
            options={STATUS_OPTIONS}
          />
        </ProForm.Group>
        <ProFormTextArea name="remark" label="备注" width="md" />
      </ModalForm>
    </>
  );
}
