import type { IToolbarItemOptions } from '@antv/xflow';
import { createToolbarConfig } from '@antv/xflow';
import { MODELS, XFlowGraphCommands, XFlowNodeCommands, IconStore} from '@antv/xflow';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useHistory } from 'umi';
import { message, Modal } from 'antd';
import type { NsGraphCmd, NsNodeCmd } from '@antv/xflow';
import { ProFormSelect } from '@ant-design/pro-components';
import { listSource } from '../service';

const portAttrs = {
  circle: {
    r: 3,
    stroke: '#31d0c6',
    strokeWidth: 2,
    fill: '#fff',
    /** 链接桩在连线交互时可以被连接上 */
    magnet: true,
  },
};

namespace NsConfig {
  /** 注册icon 类型 */
  IconStore.set('PlusCircleOutlined', PlusCircleOutlined);
  IconStore.set('DeleteOutlined', DeleteOutlined);
  IconStore.set('SaveOutlined', SaveOutlined);
  IconStore.set('ArrowLeftOutlined', ArrowLeftOutlined);
  /** nodeId */
  let id = 1;
  /** 获取toobar配置项 */
  export const getToolbarItems = async ({ history, ...rest }: any) => {
    const toolbarGroup1: IToolbarItemOptions[] = [];
    const toolbarGroup2: IToolbarItemOptions[] = [];
    /** 保存数据 */
    toolbarGroup1.push({
      id: XFlowNodeCommands.ADD_NODE.id,
      iconName: 'PlusCircleOutlined',
      tooltip: '添加节点',
      onClick: async ({ commandService }) => {
        let value = null;
        let label = null;
        Modal.confirm({
          title: '添加节点',
          // icon: <ExclamationCircleOutlined />,
          content: (
            <>
              <ProFormSelect
                label="选择配置"
                request={async () => {
                  const { data } = await listSource({});
                  return data?.map((item) => ({
                    label: item.sourceName,
                    value: item.id,
                  }));
                }}
                onChange={(_, obj) => {
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
            commandService.executeCommand<NsNodeCmd.AddNode.IArgs>(XFlowNodeCommands.ADD_NODE.id, {
              nodeConfig: {
                id: value,
                label: label,
                x: 100 + id * 5,
                y: 50 + id * 5,
                width: 160,
                height: 32,
                ports: {
                  groups: {
                    top: {
                      position: 'top',
                      attrs: portAttrs,
                    },
                    right: {
                      position: 'right',
                      attrs: portAttrs,
                    },
                    bottom: {
                      position: 'bottom',
                      attrs: portAttrs,
                    },
                    left: {
                      position: 'left',
                      attrs: portAttrs,
                    },
                  },
                  items: [
                    { id: 'top_port', group: 'top' },
                    { id: 'right_port', group: 'right' },
                    { id: 'bottom_port', group: 'bottom' },
                    { id: 'left_port', group: 'left' },
                  ],
                },
              },
            });
            id += 1;
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      },
    });

    /** 保存数据 */
    toolbarGroup2.push(
      {
        id: XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        iconName: 'SaveOutlined',
        tooltip: '保存数据',
        onClick: async ({ commandService }, ...d) => {
          commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
            XFlowGraphCommands.SAVE_GRAPH_DATA.id,
            {
              saveGraphDataService: async (meta, data) => {
                console.log(data, meta, rest);
                // message.success('nodes count:' + data.nodes.length);
                // history.goBack();
              },
            },
          );
        },
      },
      {
        id: XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        iconName: 'ArrowLeftOutlined',
        tooltip: '返回',
        onClick: async () => {
          history.goBack();
        },
      },
    );

    return [
      { name: 'nodeGroup', items: toolbarGroup1 },
      // { name: 'graphGroup', items: toolbarGroup2 },
    ];
  };

  /** 获取toolbar依赖的状态 */
  export const getToolbarState = async (modelService: any) => {
    const nodes = await MODELS.SELECTED_NODES.useValue(modelService);
    return {
      isNodeSelected: nodes.length > 0,
    };
  };
}

/** wrap出一个hook */
export const useToolbarConfig = createToolbarConfig((toolbarConfig) => {
  const history = useHistory();
  /** 生产 toolbar item */
  toolbarConfig.setToolbarModelService(async (toolbarModel) => {
    const toolbarItems = await NsConfig.getToolbarItems({ history });
    toolbarModel.setValue((toolbar) => {
      toolbar.mainGroups = toolbarItems;
    });
  });
});
