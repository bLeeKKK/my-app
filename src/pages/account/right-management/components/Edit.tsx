import { message, Form, Button } from 'antd';
import { ModalForm, ProFormText, ProForm, ProFormTreeSelect } from '@ant-design/pro-form';
import { save, treeselect } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';
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

// const handleUpdate = async (data: ParamsType) => {
//   const hide = message.loading('正在添加');
//   try {
//     await update(data);
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.warn('添加失败请重试！');
//     return false;
//   }
// };

export default function AddModalForm() {
  const { actionRef, visible, editType, edit } = useSelector((state) => state.rightManagement);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'rightManagement/setEdit',
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
        type="primary"
        key="primary"
        onClick={() => {
          dispatch({
            type: 'rightManagement/setEdit',
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
        title={`${getModel(editType)}权限`}
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
          if (edit?.menuId) {
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
          {/* 上级菜单 */}
          <ProFormTreeSelect
            name="parentId"
            label="上级权限"
            width="sm"
            fieldProps={{
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
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="menuName"
            label="名称"
            width="sm"
            rules={[{ required: true, message: '必须名称' }]}
          />
          <ProFormText
            name="perms"
            label="权限标识"
            width="sm"
            rules={[{ required: true, message: '必须权限标识' }]}
          />
          <ProFormText
            name="path"
            label="路由地址"
            width="sm"
            rules={[{ required: true, message: '必须路由地址' }]}
          />
        </ProForm.Group>
      </ModalForm>
    </>
  );
}
