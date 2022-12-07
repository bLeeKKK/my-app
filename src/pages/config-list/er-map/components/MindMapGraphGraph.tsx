import { MindMapGraph, Graph } from '@ant-design/graphs';
import { useMount } from 'ahooks';

const MindMapGraphGraph = () => {
  const data = {
    id: 'A0',
    value: {
      title: '订单金额',
      items: [
        {
          text: '3031万',
        },
      ],
    },
  };

  const level = [-2, -1, 0, 1, 2];
  const containerWidth = 1000;
  const width = 120;

  const nodeSize = [width, 40];
  const config = {
    data: data,
    autoFit: false,
    width: containerWidth,
    // level: 5,
    layout: {
      getHeight: () => {
        return 40;
      },
      getWidth: () => {
        return nodeSize[0];
      },
      getVGap: () => {
        return 16;
      },
      getHGap: () => {
        return (containerWidth / level.length - width) / 2;
      },
    },
    // level,
    nodeCfg: {
      // getChildren,
      size: nodeSize,
      padding: 4,
      style: {
        stroke: '#5AD8A6',
      },
      items: {
        padding: 0,
      },
      customContent: (item, group, cfg) => {
        const { startX, startY, width } = cfg;
        const { text, value, icon, trend } = item;
        const tagWidth = 28;
        const tagHeight = 16;
        group?.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: nodeSize[0],
            height: nodeSize[1] + 8,
            fill: '#5AD8A6',
            fillOpacity: 0.1,
          },
          // group 内唯一字段
          name: `container-${Math.random()}`,
        });
        group?.addShape('rect', {
          attrs: {
            x: startX,
            y: startY,
            width: tagWidth,
            height: tagHeight,
            fill: '#47c796',
          },
          // group 内唯一字段
          name: `tag-${Math.random()}`,
        });
        group?.addShape('text', {
          attrs: {
            textBaseline: 'middle',
            textAlign: 'center',
            x: startX + tagWidth / 2,
            y: startY + tagHeight / 2,
            text: '人群',
            fill: '#fff',
            fontSize: 10,
          },
          // group 内唯一字段
          name: `text-${Math.random()}`,
        });
        group?.addShape('text', {
          attrs: {
            textBaseline: 'middle',
            textAlign: 'start',
            x: startX + tagWidth + 4,
            y: startY + tagHeight / 2,
            text: '人群服务名称',
            fill: 'rgba(0,0,0,.65)',
            fontSize: 10,
          },
          // group 内唯一字段
          name: `text-${Math.random()}`,
        });
        const textMargin = 10;
        const sense = group?.addShape('text', {
          attrs: {
            textBaseline: 'top',
            textAlign: 'start',
            x: startX,
            y: startY + tagHeight + textMargin,
            text: '所属场景：',
            fill: 'rgba(0,0,0,.45)',
            fontSize: 10,
          },
          // group 内唯一字段
          name: `text-${Math.random()}`,
        });
        group?.addShape('text', {
          attrs: {
            textBaseline: 'top',
            textAlign: 'start',
            x: sense.getBBox().maxX,
            y: startY + tagHeight + textMargin,
            text: '这是场景名称',
            fill: 'rgba(0,0,0,.45)',
            fontSize: 10,
          },
          // group 内唯一字段
          name: `text-${Math.random()}`,
        });
        // 行高
        return 14;
      },
    },
    markerCfg: (cfg) => {
      const { children = [] } = cfg;
      return {
        position: 'right',
        show: !!children?.length,
        collapsed: !children?.length,
      };
    },
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node'],
  };

  return (
    <div style={{ width: containerWidth }}>
      <MindMapGraph {...config} />
    </div>
  );
};

const LINE_HEIGHT = 24;
const NODE_WIDTH = 150;

// Graph.registerPortLayout(
//   'erPortPosition',
//   (portsPositionArgs) => {
//     return portsPositionArgs.map((_, index) => {
//       return {
//         position: {
//           x: 0,
//           y: (index + 1) * LINE_HEIGHT,
//         },
//         angle: 0,
//       };
//     });
//   },
//   true,
// );

// Graph.registerNode(
//   'er-rect',
//   {
//     inherit: 'rect',
//     markup: [
//       {
//         tagName: 'rect',
//         selector: 'body',
//       },
//       {
//         tagName: 'text',
//         selector: 'label',
//       },
//     ],
//     attrs: {
//       rect: {
//         strokeWidth: 1,
//         stroke: '#5F95FF',
//         fill: '#5F95FF',
//       },
//       label: {
//         fontWeight: 'bold',
//         fill: '#ffffff',
//         fontSize: 12,
//       },
//     },
//     ports: {
//       groups: {
//         list: {
//           markup: [
//             {
//               tagName: 'rect',
//               selector: 'portBody',
//             },
//             {
//               tagName: 'text',
//               selector: 'portNameLabel',
//             },
//             {
//               tagName: 'text',
//               selector: 'portTypeLabel',
//             },
//           ],
//           attrs: {
//             portBody: {
//               width: NODE_WIDTH,
//               height: LINE_HEIGHT,
//               strokeWidth: 1,
//               stroke: '#5F95FF',
//               fill: '#EFF4FF',
//               magnet: true,
//             },
//             portNameLabel: {
//               ref: 'portBody',
//               refX: 6,
//               refY: 6,
//               fontSize: 10,
//             },
//             portTypeLabel: {
//               ref: 'portBody',
//               refX: 95,
//               refY: 6,
//               fontSize: 10,
//             },
//           },
//           position: 'erPortPosition',
//         },
//       },
//     },
//   },
//   true,
// );

const dataReq = [
  {
    id: '1',
    shape: 'er-rect',
    label: '学生',
    width: 150,
    height: 24,
    position: {
      x: 24,
      y: 150,
    },
    ports: [
      {
        id: '1-1',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'ID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '1-2',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Name',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '1-3',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Class',
          },
          portTypeLabel: {
            text: 'NUMBER',
          },
        },
      },
      {
        id: '1-4',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Gender',
          },
          portTypeLabel: {
            text: 'BOOLEAN',
          },
        },
      },
    ],
  },
  {
    id: '2',
    shape: 'er-rect',
    label: '课程',
    width: 150,
    height: 24,
    position: {
      x: 250,
      y: 210,
    },
    ports: [
      {
        id: '2-1',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'ID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '2-2',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Name',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '2-3',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'StudentID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '2-4',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'TeacherID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '2-5',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Description',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
    ],
  },
  {
    id: '3',
    shape: 'er-rect',
    label: '老师',
    width: 150,
    height: 24,
    position: {
      x: 480,
      y: 350,
    },
    ports: [
      {
        id: '3-1',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'ID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '3-2',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Name',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '3-3',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Age',
          },
          portTypeLabel: {
            text: 'NUMBER',
          },
        },
      },
    ],
  },
  {
    id: '4',
    shape: 'edge',
    source: {
      cell: '1',
      port: '1-1',
    },
    target: {
      cell: '2',
      port: '2-3',
    },
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    zIndex: 0,
  },
  {
    id: '5',
    shape: 'edge',
    source: {
      cell: '3',
      port: '3-1',
    },
    target: {
      cell: '2',
      port: '2-4',
    },
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    zIndex: 0,
  },
];

const GraphGraph = () => {
  useMount(() => {
    const graph = new Graph({
      container: document.getElementById('container')!,
      renderer: 'renderer',
      // connecting: {
      //   router: {
      //     name: 'er',
      //     args: {
      //       offset: 25,
      //       direction: 'H',
      //     },
      //   },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
            },
          },
        });
      },
      // },
    });
    setTimeout(() => {
      const cells: any[] = [];
      dataReq.forEach((item: any) => {
        if (item.shape === 'edge') {
          cells.push(graph.createEdge(item));
        } else {
          // cells.push(graph.createNode(item));
        }
      });
      // graph.resetCells(cells);
      // graph.zoomToFit({ padding: 10, maxScale: 1 });
    }, 1000);
  }, []);

  return (
    <>
      <div id="container" style={{ height: '800px' }} />
    </>
  );
};
export default MindMapGraphGraph;
