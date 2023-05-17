import { message, Form, Button } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { sysDictDetailSave, sysDictDetailUpdate } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { getModel } from '@/utils';
import MyAccess from '@/components/MyAccess';

export const FREEZE_OPTIONS = [
  { value: 0, label: '正常' },
  { value: 1, label: '冻结' },
];

const handleAdd = async (data: ParamsType) => {
  const hide = message.loading('正在添加');
  try {
    await sysDictDetailSave(data);
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
    await sysDictDetailUpdate(data);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.warn('修改失败请重试！');
    return false;
  }
};

export default function AddModalForm({ dictCode }) {
  const { actionRefDetails, visibleDetails, editTypeDetails, editDetails } = useSelector(
    (state) => state.dictionaryList,
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'dictionaryList/setEditDetails',
      payload: {
        editDetails: undefined,
        editTypeDetails: undefined,
        visibleDetails: false,
      },
    });
  };

  useUpdateEffect(() => {
    if (visibleDetails && editTypeDetails === 2 && editDetails) {
      form.setFieldsValue(editDetails);
    } else {
      form.resetFields();
    }
  }, [visibleDetails, editTypeDetails, editDetails]);

  return (
    <>
      <MyAccess aKey="base-config-list:dictionary-list:add-item" key="editDetails">
        {dictCode ? (
          <Button
            type="link"
            key="primary"
            onClick={() => {
              dispatch({
                type: 'dictionaryList/setEditDetails',
                payload: {
                  editDetails: undefined,
                  visibleDetails: true,
                  editTypeDetails: 1,
                },
              });
            }}
          >
            <PlusOutlined /> 新建
          </Button>
        ) : null}
      </MyAccess>
      <ModalForm
        title={`${getModel(editTypeDetails)}字典详情`}
        width="400px"
        visible={visibleDetails}
        form={form}
        onVisibleChange={(flag) => {
          if (!flag) closeModal();
        }}
        onFinish={async (value) => {
          let flag = false;
          if (editDetails?.id) {
            flag = await handleUpdate({ ...editDetails, ...value });
          } else flag = await handleAdd(value as ParamsType);
          if (flag) {
            closeModal();
            if (actionRefDetails?.current) {
              actionRefDetails.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label="字典编码"
          width="md"
          rules={[{ required: true, message: '请输入字典编码' }]}
          name="dictCode"
          disabled
          initialValue={dictCode}
        />

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
          label="实际使用值"
          width="md"
          rules={[{ required: true, message: '请输入描述' }]}
          name="value"
        />
      </ModalForm>
    </>
  );
}
