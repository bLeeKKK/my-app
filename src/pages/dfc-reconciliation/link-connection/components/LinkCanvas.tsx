import React, { useRef, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import { XFlowGraphCommands } from '@antv/xflow';
import type { IAppLoad } from '@antv/xflow';
import { Modal, message, Button } from 'antd';
import { useLocation, useHistory } from 'umi';
import {
  XFlow,
  createGraphConfig,
  XFlowCanvas,
  CanvasToolbar,
  CanvasContextMenu,
  XFlowEdgeCommands,
  useXFlowApp,
  XFlowAppProvider,
} from '@antv/xflow';
import { useToolbarConfig } from './toolbar-config';
import './index.less';
import '@antv/xflow/dist/index.css';
import { useMenuConfig } from './menu-config';
import { findByPageModel, findOne, edit as update } from '../service';
// import { assignWith } from 'lodash';
// import Relation from './react-edge/Relation';

/**  Demo Props  */
/**  graphConfig：配置Graph  */
export const useGraphConfig = createGraphConfig<any>((graphConfig) => {
  // const app = useXFlowApp();
  // console.log(app, 'useGraphConfig');

  // const handleDeleteEdge = async (relationId: string) => {
  //   const res = await app.executeCommand(XFlowEdgeCommands.DEL_EDGE.id, {
  //     edgeConfig: { id: relationId },
  //   });
  //   if (res) {
  //     message.success('删除连线成功!');
  //   }
  // };

  graphConfig.setDefaultNodeRender((props) => {
    return <div className="react-node">{props.data.label}</div>;
  });
  // graphConfig.setEdgeRender('EDGE1', (propsEdge) => {
  //   return <Relation {...propsEdge} deleteRelation={handleDeleteEdge} />;
  // });
});

const Main: React.FC<any> = (props) => {
  const history = useHistory();
  const edit = useRef({});
  const { query }: any = useLocation();
  const graphConfig = useGraphConfig(props);
  const appOrigin = useXFlowApp();
  const [saveLoading, setSaveLoading] = useState(false);

  const toolbarConfig = useToolbarConfig({ ...props, edit });
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
          title: '添加连线',
          // icon: <ExclamationCircleOutlined />,
          content: (
            <>
              <ProFormSelect
                label="选择配置"
                request={async () => {
                  const { data } = await findByPageModel({
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
          onOk: async () => {
            const edges = await appRef.getAllEdges();
            // const startEdge: any = [];

            // // 获取第一层链接线
            // edges.forEach((res: any) => {
            //   if (edges.filter((item: any) => item.data.target === res.data.source).length === 0)
            //     startEdge.push(res.data.source);
            // });
            //
            // // 判断是否存在多个起点(判断startEdge中的起点不能作为目标点（Target），存在就报出警告)
            // if (startEdge.length > 0 && startEdge.includes(relationTargetData?.id)) {
            //   message.warning('不允许存在多个起点系统');
            //   return;
            // }

            // 判断不允许回环
            if (
              edges.some((item: any) => item.data.target === relationSourceData?.id) &&
              edges.some((item: any) => item.data.source === relationTargetData?.id)
            ) {
              message.warning('不允许回环');
              return;
            }

            if (!value) {
              message.warning('没有选择配置');
              return;
            }
            const color = getRandomColor();
            const bg = getContrastTextColor(color);
            appRef.executeCommand(XFlowEdgeCommands.ADD_EDGE.id, {
              edgeConfig: {
                bg,
                color,
                id: value, // `${relationSourceData?.id}-${relationTargetData?.id}`,
                // value,
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

      graph.on('edge:click', ({ edge }: any) => {
        edge.toFront();
      });
    }
  };

  const onLoad: IAppLoad = async (app) => {
    /** 从服务端获取数据 */
    if (query.id) {
      let graphData: any = {
        nodes: [],
        edges: [],
      };
      const { success, data }: any = await findOne({ flowId: query.id });
      try {
        if (success && data.flowJson) graphData = JSON.parse(data.flowJson);
        console.log(graphData);
        edit.current = data;
      } catch (error) {
        console.log(error);
      }

      /** 渲染画布数据 */
      await app.executeCommand(XFlowGraphCommands.GRAPH_RENDER.id, {
        graphData,
      });
    }

    await watchEvent(app);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const nodes = await appOrigin.getAllNodes();
    const edges = await appOrigin.getAllEdges();
    const editData: any = edit.current;

    const newNodes = nodes.map((res: any) => {
      const node = res.data;
      node.label = node.label;
      return node;
    });

    const newEdges = edges.map((res: any) => {
      const { id, label, source, target, renderKey, edgeContentWidth, edgeContentHeight, attrs } =
        res.data;

      return {
        label,
        id,
        source,
        target,
        renderKey,
        edgeContentWidth,
        edgeContentHeight,
        attrs,
      };
    });

    // 递归处理
    const getArrSort: any = (originArr: any, preArr: any) => {
      const sort: any = [];
      originArr.forEach((res: any) => {
        for (const item of preArr) {
          if (item.target === res.source) {
            sort.push({ ...res, prevNode: item.id });
            return;
          }
        }
      });

      // 判断是否有下一层
      if (
        sort.some((item: any) =>
          originArr.some((ite: any) => item.target === ite.source && item.prevNode !== ite.id),
        )
      ) {
        return [preArr, ...getArrSort(originArr, sort)];
      }

      return sort.length ? [preArr, sort] : [preArr];
    };

    // 分层排序
    const arrSort: any = [];
    // 用户处理的数据
    const dataArr = [...newEdges];
    // 找到第一层链接
    dataArr.forEach((res: any) => {
      if (dataArr.filter((item: any) => item.target === res.source).length === 0) {
        arrSort.push(res);
      }
    });

    // 获取后面多层
    const stepArr = getArrSort(dataArr, arrSort);
    editData.dfcdzFlowNodeList = stepArr.reduce((pre: any, cur: any) => {
      return [
        ...pre,
        ...cur.map((item: any, index: number) => ({
          modelId: item.id,
          prevNode: item.prevNode,
          sort: index + 1,
        })),
      ];
    }, []);

    editData.flowJson = JSON.stringify({ edges: newEdges, nodes: newNodes });

    const { message: msg }: any = await update({
      ...editData,
    });
    setSaveLoading(false);
    message.success(msg);
    // history.goBack();
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          padding: '8px',
          marginBottom: '8px',
          background: '#fff',
          justifyContent: 'end',
        }}
      >
        <Button onClick={() => history.goBack()} style={{ marginRight: '8px' }}>
          返回
        </Button>
        <Button loading={saveLoading} type="primary" onClick={handleSave} className="btn">
          保存
        </Button>
      </div>
      <div style={{ width: '100%', height: '600px' }}>
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
      </div>
    </>
  );
};

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function getContrastTextColor(hexColor: any) {
  const hexColorFix = hexColor.replace('#', '');
  const r = parseInt(hexColorFix.substr(0, 2), 16);
  const g = parseInt(hexColorFix.substr(2, 2), 16);
  const b = parseInt(hexColorFix.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

const XFlowBox = (...props: any) => {
  return (
    <XFlowAppProvider>
      <Main {...props} />
    </XFlowAppProvider>
  );
};

export default XFlowBox;
