import React from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import type { IAppLoad } from '@antv/xflow';
import { Modal, message } from 'antd';
import {
  XFlow,
  createGraphConfig,
  XFlowCanvas,
  CanvasToolbar,
  CanvasContextMenu,
  XFlowEdgeCommands,
  useXFlowApp,
} from '@antv/xflow';
import { useToolbarConfig } from './toolbar-config';
import './index.less';
import '@antv/xflow/dist/index.css';
import { useMenuConfig } from './menu-config';
import { findByPage } from '../service';
import Relation from './react-edge/Relation';

/**  Demo Props  */
export interface IDemoProps {
  anything: string;
}
/**  graphConfig：配置Graph  */
export const useGraphConfig = createGraphConfig<IDemoProps>((graphConfig) => {
  const app = useXFlowApp();

  const handleDeleteEdge = async (relationId: string) => {
    const res = await app.executeCommand(XFlowEdgeCommands.DEL_EDGE.id, {
      edgeConfig: { id: relationId },
    });
    if (res) {
      message.success('删除连线成功!');
    }
  };

  graphConfig.setDefaultNodeRender((props) => {
    return <div className="react-node"> {props.data.label} </div>;
  });
  graphConfig.setEdgeRender('EDGE1', (propsEdge) => {
    return <Relation {...propsEdge} deleteRelation={handleDeleteEdge} />;
  });
});

const XFlowDemo: React.FC<IDemoProps> = (props) => {
  const graphConfig = useGraphConfig(props);
  const toolbarConfig = useToolbarConfig(props);
  const menucConfig = useMenuConfig(props);

  const watchEvent = async (appRef: any) => {
    if (appRef) {
      const graph = await appRef.getGraphInstance();
      graph.on('edge:connected', ({ edge }: any) => {
        /** 拖拽过程中会生成一条无实际业务含义的线, 需要手动删除 */
        const edgeData = edge?.getData();
        if (!edgeData) {
          appRef.executeCommand(XFlowEdgeCommands.DEL_EDGE.id, {
            x6Edge: edge,
          });
        }

        const relationSourceData = edge?.getSourceNode()?.data;
        const relationTargetData = edge?.getTargetNode()?.data;

        let value: any = null;
        let label: any = null;

        Modal.confirm({
          title: '添加节点',
          // icon: <ExclamationCircleOutlined />,
          content: (
            <>
              <ProFormSelect
                label="选择配置"
                request={async () => {
                  const { data } = await findByPage({
                    size: 100000,
                    primaryEntityId: relationSourceData.id,
                    subEntityId: relationTargetData.id,
                  });
                  return data?.records?.map((item: any) => ({
                    label: item.modelName,
                    value: item.id,
                  }));
                }}
                onChange={(_: any, obj: any) => {
                  value = obj?.value;
                  label = obj?.label;
                }}
              />
            </>
          ),
          onOk() {
            if (!value) {
              message.warning('没有选择配置');
              return;
            }
            console.log('edge:connected', relationSourceData, relationTargetData, label, value);
            const color = getRandomColor();
            const bg = getContrastTextColor(color);
            appRef.executeCommand(XFlowEdgeCommands.ADD_EDGE.id, {
              edgeConfig: {
                bg,
                color,
                id: `${relationSourceData?.id}-${relationTargetData?.id}`,
                value,
                label,
                relationSourceData,
                relationTargetData,
                source: relationSourceData?.id,
                target: relationTargetData?.id,
                renderKey: 'EDGE1',
                edgeContentWidth: 20,
                edgeContentHeight: 20,
                /** 设置连线样式 */
                attrs: {
                  line: {
                    stroke: '#d8d8d8',
                    strokeWidth: 1,
                    targetMarker: {
                      name: 'classic',
                    },
                  },
                },
              },
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      });

      graph.on('edge:click', ({ edge }) => {
        edge.toFront();
      });
    }
  };

  const onLoad: IAppLoad = async (app) => {
    watchEvent(app);
  };

  return (
    <XFlow onLoad={onLoad} className="xflow-workspace canvas-toolbar-basic">
      <CanvasToolbar
        layout="horizontal"
        config={toolbarConfig}
        position={{ top: 0, left: 0, right: 0, height: 40 }}
      />
      <XFlowCanvas config={graphConfig} position={{ top: 40, bottom: 0, left: 0, right: 0 }}>
        <CanvasContextMenu config={menucConfig} />
      </XFlowCanvas>
    </XFlow>
  );
};

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function getContrastTextColor(hexColor) {
  hexColor = hexColor.replace('#', '');
  var r = parseInt(hexColor.substr(0, 2), 16);
  var g = parseInt(hexColor.substr(2, 2), 16);
  var b = parseInt(hexColor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

export default XFlowDemo;
