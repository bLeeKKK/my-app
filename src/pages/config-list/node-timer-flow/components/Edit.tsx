import { message, Form, Button } from 'antd';
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSelect,
  ProFormDigit,
} from '@ant-design/pro-form';
import { save, update, findAllSmallNode, findByValidityPeriodCode } from '../service';
import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useAsyncEffect, useUpdateEffect } from 'ahooks';
import { getModel } from '@/utils';

export const FREEZE_OPTIONS = [
  { value: false, label: '正常' },
  { value: true, label: '冻结' },
];
export const ROLEIDS_OPTIONS = [
  { value: true, label: '读取节点合同时效标准' },
  { value: false, label: '读取输入时效标准' },
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
    message.success('编辑成功');
    return true;
  } catch (error) {
    hide();
    message.warn('编辑失败请重试！');
    return false;
  }
};

export default function AddModalForm() {
  const { actionRef, visible, editType, edit, parent } = useSelector(
    (state) => state.nodeTimerFlow,
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'nodeTimerFlow/setEdit',
      payload: {
        edit: undefined,
        editType: undefined,
        visible: false,
      },
    });
  };

  useAsyncEffect(async () => {
    if (visible && edit?.validityPeriodCode) {
      const { success, data } = await findByValidityPeriodCode(edit.validityPeriodCode);
      if (success) {
        form.setFieldsValue({
          nodeValidityPeriodConfigDetailList: (data?.businessFlowChildNodeList || []).map(
            (res: { majorNodeCode: any; smallNodeName: any; smallNodeCode: any }) => ({
              label: `${res.smallNodeName}(${res.smallNodeCode})`,
              value: res.smallNodeCode,
              majorNodeCode: res.majorNodeCode,
              smallNodeCode: res.smallNodeCode,
            }),
          ),
        });
      }
      console.log(success, data);
    }
  }, [visible, edit]);

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
            type: 'nodeTimerFlow/setEdit',
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
        title={`${getModel(editType)}业务流程配置`}
        width="800px"
        visible={visible}
        form={form}
        onVisibleChange={(flag) => {
          if (!flag) closeModal();
        }}
        onFinish={async (value) => {
          let flag = false;
          if (edit && edit.id) {
            flag = await handleUpdate({ ...edit, ...value });
          } else {
            flag = await handleAdd({ ...value, parent: parent ? parent.id : 0 });
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
            label="时效名称"
            width="md"
            rules={[{ required: true, message: '请输入时效名称' }]}
            name="validityPeriodName"
          />
          <ProFormRadio.Group
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue={false}
            label="状态"
            width="md"
            name="freeze"
            options={FREEZE_OPTIONS}
          />
        </ProForm.Group>
        {parent?.id || edit?.parent ? (
          <>
            <ProForm.Group>
              <ProFormDigit
                name="warningTimeComplete"
                label="整车时效标准"
                width="md"
                rules={[{ required: true, message: '必须整车时效标准' }]}
              />
              <ProFormDigit
                name="warningTimeLess"
                label="零担时效标准"
                width="md"
                rules={[{ required: true, message: '必须零担时效标准' }]}
              />
              <ProFormRadio.Group
                name="warningTimeSource"
                label="时效标准来源"
                width="md"
                options={ROLEIDS_OPTIONS}
              />
            </ProForm.Group>
            <ProFormSelect
              name="nodeValidityPeriodConfigDetailList"
              label="小节点"
              width="md"
              fieldProps={{
                mode: 'multiple',
                autoClearSearchValue: false,
                labelInValue: true,
              }}
              request={async () => {
                const { data = [], success } = await findAllSmallNode();
                if (success) {
                  return data.map(
                    (res: { majorNodeCode: any; smallNodeName: any; smallNodeCode: any }) => ({
                      label: `${res.smallNodeName}(${res.smallNodeCode})`,
                      value: res.smallNodeCode,
                      majorNodeCode: res.majorNodeCode,
                      smallNodeCode: res.smallNodeCode,
                    }),
                  );
                }
                return [];
              }}
            />
            {/* <ProFormCheckbox.Group
              name="nodeValidityPeriodConfigDetailList"
              label="小节点"
              request={async () => {
                const { data = [], success } = await findAllSmallNode();
                if (success) {
                  return data.map((res: { smallNodeName: any; smallNodeCode: any }) => ({
                    label: `${res.smallNodeName}(${res.smallNodeCode})`,
                    value: res.smallNodeCode,
                  }));
                }
                return [];
              }}
            /> */}
          </>
        ) : null}
      </ModalForm>
    </>
  );
}
