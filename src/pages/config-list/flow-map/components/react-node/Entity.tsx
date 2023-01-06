import { useState } from 'react';
import type { NsGraph, NsNodeCmd } from '@antv/xflow';
import type { EntityCanvasModel, EntityProperty } from '../interface';
import { BarsOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { EntityType } from '../const';
import { useBoolean, useUpdateEffect } from 'ahooks';
import { XFlowNodeCommands, useXFlowApp } from '@antv/xflow';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-form';

import './Entity.less';

interface OwnProps {
  deleteNode: Function;
}

type Props = OwnProps & NsGraph.IReactNodeProps;

const Entity = (props: Props) => {
  const entity: EntityCanvasModel = props?.data;
  const app = useXFlowApp();
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [form] = Form.useForm();
  const [editNode, setEditNode] = useState();

  useUpdateEffect(() => {
    if (editNode) {
      form.setFieldsValue(editNode);
    } else {
      form.resetFields();
    }
  }, [editNode]);

  useUpdateEffect(() => {
    if (!visible) setEditNode(undefined);
  }, [visible]);

  const getCls = () => {
    if (entity?.entityType === EntityType.FACT) {
      return 'fact';
    }
    if (entity?.entityType === EntityType.DIM) {
      return 'dim';
    }
    if (entity?.entityType === EntityType.OTHER) {
      return 'other';
    }
    return '';
  };

  return (
    <>
      <div className={`entity-container ${getCls()}`}>
        <div className={`content ${getCls()}`}>
          <div className="head">
            <div>
              <BarsOutlined className="type" />
              <span>{entity?.nodeCode}</span>
              <span>（{entity?._nodeName}）</span>
            </div>
            <div className="icon-box">
              <PlusOutlined className="icon" onClick={setTrue} />
              <DeleteOutlined className="icon" onClick={() => props.deleteNode(entity?.id)} />
            </div>
          </div>
          <div className="body">
            {entity?.childNodeList?.map((property: EntityProperty) => {
              return (
                <div className="body-item" key={property.majorNodeCode}>
                  <div className="name">{property?.smallNodeName}</div>
                  {/* <div className="type">{property.smallNodeRemark}</div> */}
                  <div>
                    <span
                      className="btn"
                      onClick={() => {
                        // property.majorNodeCode
                        const obj = entity.childNodeList.find(
                          (res) => res.smallNodeCode === property.smallNodeCode,
                        );
                        if (obj) {
                          setEditNode(obj);
                          setTrue();
                        }
                      }}
                    >
                      编辑
                    </span>
                    <span
                      className="btn"
                      onClick={() => {
                        // property.majorNodeCode
                        const childNodeList = entity.childNodeList.filter(
                          (res) => res.smallNodeCode !== property.smallNodeCode,
                        );
                        app.commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
                          XFlowNodeCommands.UPDATE_NODE.id,
                          {
                            nodeConfig: { ...entity, childNodeList },
                          },
                        );
                      }}
                    >
                      删除
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ModalForm
        title={`添加小节点`}
        width="600px"
        layout="horizontal"
        visible={visible}
        form={form}
        onVisibleChange={(flag) => {
          if (!flag) setFalse();
        }}
        onFinish={async (value) => {
          const initArr = entity?.childNodeList || [];
          let childNodeList = initArr;
          if (editNode) {
            const index = initArr.findIndex((res) => res.smallNodeCode === editNode?.smallNodeCode);
            if (index >= 0) {
              childNodeList.splice(index, 1, value);
            }
          } else {
            childNodeList = [...initArr, value];
          }
          app.commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
            XFlowNodeCommands.UPDATE_NODE.id,
            {
              nodeConfig: { ...entity, childNodeList },
            },
          );
          setFalse();
        }}
      >
        <ProFormText
          label="关联大节点主键"
          width="md"
          rules={[{ required: true, message: '必须存在关联大节点主键' }]}
          name="majorNodeCode"
          initialValue={entity?.nodeCode}
          readonly
        />
        <ProFormText
          label="小节点代码"
          width="md"
          rules={[{ required: true, message: '必须存在小节点代码' }]}
          name="smallNodeCode"
        />
        <ProFormText
          label="小节点名称"
          width="md"
          rules={[{ required: true, message: '必须存在小节点名称' }]}
          name="smallNodeName"
        />
        <ProFormTextArea name="smallNodeRemark" label="小节点备注" placeholder="请输入小节点备注" />
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
      </ModalForm>
    </>
  );
};

export default Entity;
