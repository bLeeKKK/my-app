import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-form';
import { useUpdateEffect } from 'ahooks';
import type { NsNodeCmd } from '@antv/xflow';
import { XFlowNodeCommands, useXFlowApp } from '@antv/xflow';
// import './index.less';

interface Props {
  visible: boolean;
  onOk: Function;
  onCancel: Function;
  flowData: unknown;
  edit?: any;
  setEditBigNode?: Function;
  setVisible?: Function;
}

/** 创建模型弹窗 */
const CreateEntityModal = (props: Props) => {
  const { visible, onOk, onCancel, flowData, edit, setEditBigNode, setVisible } = props;
  const [form] = Form.useForm();
  const app = useXFlowApp();

  useUpdateEffect(() => {
    if (edit) {
      form.setFieldsValue(edit);
    } else {
      form.resetFields();
    }
  }, [edit]);

  useUpdateEffect(() => {
    if (!visible) setEditBigNode(undefined);
  }, [visible]);

  return (
    <ModalForm
      title={`添加节点`}
      width="600px"
      layout="horizontal"
      visible={visible}
      form={form}
      onVisibleChange={(flag) => {
        if (!flag) onCancel();
      }}
      onFinish={async (value) => {
        if (edit) {
          app.commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
            XFlowNodeCommands.UPDATE_NODE.id,
            {
              nodeConfig: {
                ...edit,
                ...value,
                id: value.nodeCode,
              },
            },
          );
          setVisible(false);
          return;
        }
        onOk(value);
      }}
    >
      <ProFormText
        label="关联流程编号"
        width="md"
        rules={[{ required: true, message: '必须存在关联流程编号' }]}
        name="busFlowCode"
        initialValue={flowData?.busFlowCode}
        readonly
      />
      <ProFormText
        label="节点代码"
        width="md"
        rules={[{ required: true, message: '必须存在节点代码' }]}
        name="nodeCode"
      />
      <ProFormText
        label="	节点名称"
        width="md"
        rules={[{ required: true, message: '必须存在节点名称' }]}
        name="_nodeName"
      />
      <ProFormTextArea name="nodeRemark" label="节点备注" placeholder="请输入节点备注" />
      <ProFormDigit name="warningTime" label="预警时效" placeholder="请输入预警时效" />
      <ProFormRadio.Group
        name="freeze"
        label="状态"
        initialValue={0}
        options={[
          { label: '正常', value: 0 },
          { label: '冻结', value: 1 },
        ]}
      />
      <ProFormRadio.Group
        name="ifWarning"
        label="是否开启预警"
        options={[
          { label: '是', value: true },
          { label: '否', value: false },
        ]}
      />
      <ProFormRadio.Group
        initialValue={0}
        name="comprehensive"
        label="是否展示"
        options={[
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ]}
      />
    </ModalForm>
  );
};

export default CreateEntityModal;
