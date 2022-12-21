import { PageContainer } from '@ant-design/pro-layout';
// import MindMapGraphGraph from './components/MindMapGraphGraph';
// import DemoFlowchart from './components/DemoFlowchart';
// import Flowchart from './components/Flowchart';
import { useRef } from 'react';
import XFalow from './components/XFalow';
import { ProCard } from '@ant-design/pro-components';
// import { ArrowLeftOutlined } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';
import { useLocation, useHistory } from 'umi';
import { update } from './sercice';
import { message } from 'antd';
import './index.less';

const handleUpdate = async (data) => {
  const { edges = [], nodes = [], flowData = {} } = data;
  const newData = { ...flowData };
  const hide = message.loading('正在修改');
  try {
    const obj = {};
    edges.forEach((res) => {
      const [id, target] = res.id.split('-');
      obj[id] = target;
    });

    const newNodes = nodes.map((res) => {
      const node = res.data;
      node.nodeName = node._nodeName;
      node.nextNodeId = obj[node.id];
      return node;
    });
    const newEdges = edges.map((res) => {
      const { id, source, target, renderKey, edgeContentWidth, edgeContentHeight, attrs } =
        res.data;

      return {
        id,
        source,
        target,
        renderKey,
        edgeContentWidth,
        edgeContentHeight,
        attrs,
      };
    });

    newData.majorNodeList = newNodes;
    newData.nodeJson = JSON.stringify({ edges: newEdges, nodes: newNodes });
    await update(newData);
    hide();
    message.success('保存成功');
    return true;
  } catch (error) {
    console.log(error);
    hide();
    message.warn('添加失败请重试！');
    return false;
  }
};

const FlowMap = () => {
  const { query } = useLocation();
  const history = useHistory();
  const ref = useRef();
  const id = query?.id;

  const save = async (val) => {
    const app = ref.current?.app;
    const flowData = ref.current?.flowData;
    const nodes = await app.getAllNodes();
    const edges = await app.getAllEdges();
    const data = handleUpdate({ edges, nodes, flowData });
  };

  return (
    <PageContainer>
      <ProCard direction="column" ghost gutter={[0, 16]}>
        {/* <ProCard bordered>
          <Row>
            <Col span={12}>
              <ArrowLeftOutlined onClick={() => history.goBack()} style={{ fontSize: '28px' }} />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button onClick={() => history.goBack()} className="btn">
                保存
              </Button>
              <Button type="primary" onClick={save} className="btn">
                保存
              </Button>
            </Col>
          </Row>
        </ProCard> */}
        <div className="btn-box">
          <Button onClick={() => history.goBack()} className="btn">
            返回
          </Button>
          <Button type="primary" onClick={save} className="btn">
            保存
          </Button>
        </div>
        <ProCard ghost bordered>
          <div style={{ width: '100%', height: '600px' }}>
            <XFalow ref={ref} id={id} save={save} />
          </div>
        </ProCard>
      </ProCard>
      {/* <Prompt when={true} message="您确定半途而废么？" /> */}
    </PageContainer>
  );
};

export default FlowMap;
