import { Form } from 'antd';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { useXFlowApp } from '@antv/xflow';
import { useEffect } from 'react';

const { useForm } = Form;

const CreateRelationModal = (props) => {
  const { visible, sourceEntity, targetEntity, onOk, onCancel } = props;
  const app = useXFlowApp();
  const [form] = useForm();

  useEffect(() => {
    if (visible && sourceEntity?.id && targetEntity?.id) {
      form.setFieldsValue({
        SOURCE_GUID: sourceEntity.id,
        TARGET_GUID: targetEntity.id,
      });
    } else {
      form.resetFields();
    }
  }, [visible, sourceEntity, targetEntity]);

  return (
    <ModalForm
      title={`添加连接`}
      width="400px"
      layout="horizontal"
      visible={visible}
      form={form}
      onVisibleChange={(flag) => {
        if (!flag) onCancel();
      }}
      onFinish={async (value) => {
        onOk(value);
      }}
    >
      <ProFormSelect
        label="源节点"
        width="md"
        rules={[{ required: true, message: '必须存在源节点' }]}
        name="SOURCE_GUID"
        initialValue={sourceEntity?.id}
        request={async () => {
          const nodes = await app?.getAllNodes();
          return nodes.map((res) => ({
            label: `${res?.data?._nodeName}（${res?.data?.nodeCode}）`,
            value: res?.data?.nodeCode,
          }));
        }}
      />
      <ProFormSelect
        label="目标节点"
        width="md"
        rules={[{ required: true, message: '必须存在目标节点' }]}
        name="TARGET_GUID"
        initialValue={targetEntity?.id}
        request={async () => {
          const nodes = await app?.getAllNodes();
          return nodes.map((res) => ({
            label: `${res?.data?._nodeName}（${res?.data?.nodeCode}）`,
            value: res?.data?.nodeCode,
          }));
        }}
      />
    </ModalForm>
  );
};

export default CreateRelationModal;
