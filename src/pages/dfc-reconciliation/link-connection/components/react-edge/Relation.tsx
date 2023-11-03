import { Popover, Tooltip } from 'antd';
import './Relation.less';

const Relation = (props: any) => {
  const renderRelationOperationItem = (relation: any) => {
    return (
      <div className="relation-operation-item" key={relation.id}>
        <div className="relation-operation-item-content">
          <Tooltip placement="top" title={relation?.relationSourceData?.label}>
            <span className="relation-property-source">{relation?.relationSourceData?.label}</span>
          </Tooltip>
          {/* (N:1) */}
          <Tooltip placement="top" title={relation?.relationTargetData?.label}>
            <span className="relation-property-target">{relation?.relationTargetData?.label}</span>
          </Tooltip>
        </div>
        {/* <Popconfirm */}
        {/*   placement="leftTop" */}
        {/*   title="你确定要删除该关系吗" */}
        {/*   okText="确定" */}
        {/*   cancelText="取消" */}
        {/*   onConfirm={() => { */}
        {/*     props?.deleteRelation(relation?.id); */}
        {/*   }} */}
        {/* > */}
        {/*   <ScissorOutlined /> */}
        {/* </Popconfirm> */}
      </div>
    );
  };

  const renderPopoverContent = () => {
    return (
      <div
        className="relation-operation-container"
        // style={{ color: props.color, background: props.bg }}
      >
        {renderRelationOperationItem(props?.data)}
      </div>
    );
  };

  return (
    <Popover
      trigger={'hover'}
      content={renderPopoverContent()}
      overlayClassName="relation-operation-popover"
    >
      {/* <div className="relation-count-container">{relation?.label || ''}</div> */}
    </Popover>
  );
};

export default Relation;
