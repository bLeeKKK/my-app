import { message, Form, Button } from 'antd';
import {
  ProFormRadio,
  ModalForm,
  ProFormText,
  ProForm,
  ProFormTreeSelect,
  ProFormDigit,
} from '@ant-design/pro-form';
import { save, treeselect } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { getModel } from '@/utils';
import { useWatch } from 'antd/lib/form/Form';

export const STATUS_OPTIONS = [
  { value: false, label: '正常' },
  { value: true, label: '停用' },
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
  const { actionRef, visible, editType, edit } = useSelector((state) => state.rightManagement);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const menuType = useWatch('menuType', form);

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
        form={form}
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
            initialValue={0}
            fieldProps={{
              fieldNames: {
                value: 'id',
                label: 'label',
                children: 'children',
              },
            }}
            request={async () => {
              const { data = [] } = await treeselect();
              const warrperData = [
                {
                  children: data,
                  id: 0,
                  label: '主目录',
                },
              ];
              return warrperData;
            }}
          />
          <ProFormRadio.Group
            name="menuType"
            initialValue="M"
            label="菜单类型"
            options={[
              {
                label: '目录',
                value: 'M',
              },
              {
                label: '菜单',
                value: 'C',
              },
              {
                label: '功能项',
                value: 'F',
              },
            ]}
          />
          {menuType === 'F' || <ProFormText name="icon" label="菜单图标" width="sm" />}
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="menuName"
            label="名称"
            width="sm"
            rules={[{ required: true, message: '必须名称' }]}
          />
          {/* <ProFormDigit
            rules={[{ required: true, message: '必须排序' }]}
            label="显示排序"
            name="orderNum"
            width="sm"
            min={1}
          /> */}
          {menuType === 'F' || (
            <ProFormText
              tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
              name="path"
              label="路由地址"
              width="sm"
              rules={[{ required: true, message: '必须路由地址' }]}
            />
          )}
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            tooltip="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
            name="perms"
            label="权限标识"
            width="sm"
          />
          {menuType === 'C' && (
            <ProFormText
              tooltip="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
              name="component"
              label="组件路径"
              width="sm"
            />
          )}
          {menuType === 'C' && (
            <ProFormText
              tooltip='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
              name="query"
              label="路由参数"
              width="sm"
            />
          )}
        </ProForm.Group>
        <ProForm.Group>
          {menuType === 'F' || (
            <ProFormRadio.Group
              tooltip="选择是外链则路由地址需要以`http(s)://`开头"
              name="isFrame"
              initialValue={true}
              label="是否外链"
              width="sm"
              options={[
                {
                  label: '是',
                  value: false,
                },
                {
                  label: '否',
                  value: true,
                },
              ]}
            />
          )}
          {menuType === 'F' || (
            <ProFormRadio.Group
              tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
              name="visible"
              initialValue={false}
              label="显示状态"
              width="sm"
              options={[
                {
                  label: '显示',
                  value: false,
                },
                {
                  label: '隐藏',
                  value: true,
                },
              ]}
            />
          )}
          <ProFormRadio.Group
            tooltip="选择停用则路由将不会出现在侧边栏，也不能被访问"
            name="status"
            initialValue={false}
            label="功能状态"
            width="sm"
            options={STATUS_OPTIONS}
          />
        </ProForm.Group>
      </ModalForm>
    </>
  );
}
