import { useState, useEffect } from 'react';
import { Flowchart, FormWrapper } from '@ant-design/flowchart';
import { Input } from 'antd';

const BigNode = (props) => {
  const { size = { width: 120, height: 50 }, data } = props;
  const { width, height } = size;
  const { label = '自定义节点', stroke = '#ccc', fill = '#fff', fontFill, fontSize } = data;

  return (
    <div
      type="circle"
      style={{
        position: 'relative',
        display: 'block',
        background: '#fff',
        border: '1px solid #84b2e8',
        borderRadius: '2px',
        padding: '10px 12px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.20)',
        width,
        height,
        borderColor: stroke,
        backgroundColor: fill,
        color: fontFill,
        fontSize,
      }}
    >
      <div style={{ color: fontFill }}>{label}</div>
    </div>
  );
};

const SmallNode = (props) => {
  const { size = { width: 120, height: 50 }, data } = props;
  const { width, height } = size;
  const { label = '自定义节点', stroke = '#ccc', fill = '#fff', fontFill, fontSize } = data;

  return (
    <div
      style={{
        position: 'relative',
        display: 'block',
        background: '#fff',
        border: '1px solid #84b2e8',
        borderRadius: '2px',
        padding: '10px 12px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.20)',
        width,
        height,
        borderColor: stroke,
        backgroundColor: fill,
        color: fontFill,
        fontSize,
      }}
    >
      <div style={{ color: fontFill }}>{label}</div>
    </div>
  );
};

const InputComponent = (props) => {
  const { config, plugin = {} } = props;
  const { placeholder, disabled } = config;
  const { updateNode } = plugin;
  const [label, setLabel] = useState(config?.label);

  const onLabelChange = async (e) => {
    setLabel(e.target.value);
    updateNode({
      label: e.target.value,
    });
  };

  useEffect(() => {
    setLabel(config?.label);
  }, [config]);

  return (
    <div style={{ padding: 12 }}>
      <label>节点名称: </label>
      <Input value={label} onChange={onLabelChange} placeholder={placeholder} disabled={disabled} />
    </div>
  );
};

const RenameService = (props) => {
  return (
    <FormWrapper {...props}>
      {(config, plugin) => <InputComponent {...props} plugin={plugin} config={config} />}
    </FormWrapper>
  );
};

const CanvasService = (props) => {
  return <p style={{ textAlign: 'center' }}>主画布</p>;
};

export const controlMapService = (controlMap) => {
  controlMap.set('rename-service', RenameService);
  controlMap.set('canvas-service', CanvasService);
  return controlMap;
};

const formSchemaService = async (args) => {
  const { targetType } = args;
  const isGroup = args.targetData?.isGroup;
  const nodeSchema = {
    tabs: [
      {
        name: '设置',
        groups: [
          {
            name: 'groupName',
            controls: [
              {
                label: '节点名',
                name: '自定义form',
                shape: 'rename-service',
                placeholder: '节点名称',
              },
            ],
          },
        ],
      },
    ],
  };

  if (isGroup) {
    // TODO
  }

  if (targetType === 'node') {
    return nodeSchema;
  }

  if (targetType === 'edge') {
    // TODO
  }

  return {
    tabs: [
      {
        name: '设置',
        groups: [
          {
            name: 'groupName',
            controls: [
              {
                label: '',
                name: 'canvas-service',
                shape: 'canvas-service',
              },
            ],
          },
        ],
      },
    ],
  };
};

const DemoFlowchart = () => {
  return (
    <div style={{ height: 600 }}>
      <Flowchart
        onSave={(d) => {
          console.log(d);
        }}
        toolbarPanelProps={{
          position: {
            top: 0,
            left: 0,
            right: 0,
          },
        }}
        scaleToolbarPanelProps={{
          layout: 'horizontal',
          position: {
            right: 0,
            top: -40,
          },
          style: {
            width: 150,
            height: 39,
            left: 'auto',
            background: 'transparent',
          },
        }}
        canvasProps={{
          position: {
            top: 40,
            left: 0,
            right: 0,
            bottom: 0,
          },
        }}
        nodePanelProps={{
          position: { width: 160, top: 40, bottom: 0, left: 0 },
          defaultActiveKey: ['custom'], // ['custom', 'official']
          showOfficial: false,
          registerNode: {
            title: '指标节点',
            nodes: [
              {
                name: 'custom-node-big',
                component: BigNode,
                popover: () => <div>大节点</div>,
                width: 120,
                height: 50,
                label: '大',
                ports: [
                  {
                    id: 'port1',
                    type: 'input',
                    position: 'left',
                    label: '左',
                  },
                  {
                    id: 'port2',
                    type: 'output',
                    position: 'right',
                    label: '右',
                  },
                ],
              },
              {
                component: SmallNode,
                popover: () => <div>小节点</div>,
                name: 'custom-node-small',
                type: 'small',
                width: 50,
                height: 50,
                label: '小',
              },
            ],
          },
        }}
        detailPanelProps={{
          position: { width: 200, top: 40, bottom: 0, right: 0 },
          formSchemaService,
          controlMapService,
        }}
      />
    </div>
  );
};

export default DemoFlowchart;
