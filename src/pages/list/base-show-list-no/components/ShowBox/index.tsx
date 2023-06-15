import { useState, Fragment } from 'react';
import { Empty, Tag, Table, Popover, Row, Col } from 'antd';
import styles from './styles.less';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
// import { useRafInterval } from 'ahooks';
import TableShowMessage from '@/components/TableShowMessage';

const regTimec = /^\d{10,13}$/;

function intoChild(arr, render) {
  const newArr = arr.map((res) => {
    // 不处理字段
    if (res.dataIndex === 'sourceCode') return { ...res, fixed: 'left', width: '100px' };
    if (res.dataIndex?.includes('.currentCode1')) {
      return {
        ...res,
        width: '100px',
        render: (_, record) => {
          return getDeepObj(record, res.dataIndex);
        },
      };
    }
    if (
      res.dataIndex === 'MOFC_Order_B105' ||
      res.dataIndex === 'MOFC_Order_B106' ||
      res.dataIndex === 'LRP_Dispatch_B162' ||
      res.dataIndex === 'LRP_Dispatch_B172'
    ) {
      return {
        ...res,
        width: '100px',
        render: (e, record) => {
          //现货|期货
          return e.remark ? e.remark : '-';
        },
      };
    }
    if (res.dataIndex === 'product_source_type') {
      return {
        ...res,
        width: '100px',
        render: (e, record) => {
          //现货|C+3|计划
          if (e.sourceType === 0) {
            return '现货';
          } else if (e.sourceType === 1) {
            return '期货';
          } else if (e.sourceType === 2) {
            return 'C+3';
          } else {
            return '-';
          }
          // return e.remark ? e.remark : '-';
        },
      };
    }
    if (
      res.dataIndex === 'MOFC_Order_B100' ||
      // res.dataIndex === 'MOFC_Order_B101' ||
      res.dataIndex === 'MOFC_Order_B104' ||
      res.dataIndex === 'LRP_Dispatch_B112' ||
      res.dataIndex === 'LRP_Dispatch_B122'
    ) {
      return {
        ...res,
        width: '100px',
        render: (e, record) => {
          return e.remark ? moment(e.remark).format('YYYY-MM-DD HH:mm:ss') : '-';
        },
      };
    }
    if (res.dataIndex === 'LRP_Dispatch_B113') {
      return {
        ...res,
        width: '100px',
        render: (e, record) => {
          return e.remark && e.LRP_Dispatch_B114
            ? moment(e.remark).format('YYYY-MM-DD HH:mm:ss')
            : '-';
        },
      };
    }
    if (res.dataIndex === 'MOFC_Order_B102' || res.dataIndex === 'MOFC_Order_B101') {
      return {
        ...res,
        width: '100px',
        render: (e, record) => {
          return e.remark ? moment(e.remark).format('YYYY-MM-DD') : '-';
        },
      };
    }
    res.dataIndex = Array.isArray(res?.dataIndex)
      ? res.dataIndex
      : res?.dataIndex?.split?.('.') || res.dataIndex;
    if (res.children && res.children.length) {
      res.children = intoChild(res.children, render);
      return {
        ...res,
        width: '100px',
      };
    }

    // 最小节点
    return {
      ...res,
      render,
      width: '100px',
    };
  });
  return newArr;
}

// 两个时间差 时分秒
export const timeDiff = (startTime, endTime) => {
  const start = moment(startTime, 'YYYY-MM-DD HH:mm:ss');
  const end = moment(endTime, 'YYYY-MM-DD HH:mm:ss');
  const diff = end.diff(start);
  const duration = moment.duration(diff);
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours || 0}小时${minutes || 0}分钟${seconds || 0}秒`;
};

function ShowBoxList({ data }) {
  const sourceSysList = data?.sourceSysList;
  const [now, setNow] = useState(new Date());

  // useRafInterval(() => {
  //   setNow(new Date());
  // }, 1000);

  return (
    <div className={styles.warper}>
      <ul className={styles['ul-box']}>
        {sourceSysList?.map((res1) => (
          <li key={res1.sourceSys} className={styles['li-box']}>
            <div className={styles['big-node']}>{res1.sourceSys}</div>
            <div className={styles['det-time']}>
              {timeDiff(res1.startDate, res1.endDate || now)}
            </div>
            <div className={styles['small-nodes']}>
              {res1?.fullLinkRecordNodeVoList?.length ? (
                res1?.fullLinkRecordNodeVoList?.map((res) => {
                  let checkHideKey = false;
                  if (res1.sourceSys === 'MOFC' && data.ifFutures === false) {
                    checkHideKey = true;
                  }
                  return (
                    <div className={styles['small-nodes-title']} key={res.nodeName}>
                      <div>{res.nodeName}</div>
                      {res?.fullLinkRecordVoList?.map((res) => {
                        if (checkHideKey && data.hiddenNodeCodes.includes(res.nodeCode)) {
                          return '';
                        } else {
                          //根据节点名字控制渲染方式
                          if (
                            res.nodeCode === 'MOFC_Order_B105' ||
                            res.nodeCode === 'MOFC_Order_B106' ||
                            res.nodeCode === 'LRP_Dispatch_B162' ||
                            res.nodeCode === 'LRP_New_B102' ||
                            res.nodeCode === 'MOFC_Order_B107' ||
                            res.nodeCode === 'LRP_Dispatch_B172'
                          ) {
                            return res.remark;
                          } else if (res.nodeCode === 'product_source_type') {
                            if (res.sourceType === 0) {
                              return '现货';
                            } else if (res.sourceType === 1) {
                              return '期货';
                            } else if (res.sourceType === 2) {
                              return 'C+3';
                            } else {
                              return '-';
                            }
                          } else if (
                            res.nodeCode === 'MOFC_Order_B100' ||
                            res.nodeCode === 'MOFC_Order_B101' ||
                            res.nodeCode === 'MOFC_Order_B104' ||
                            res.nodeCode === 'LRP_Dispatch_B112' ||
                            res.nodeCode === 'LRP_Dispatch_B122'
                          ) {
                            return res.remark
                              ? moment(res.remark).format('YYYY-MM-DD HH:mm:ss')
                              : '-';
                          } else {
                            return (
                              <>
                                <div className={styles['small-node-show']} key={res.smallNodeCode}>
                                  <div className={styles['show-left']}>
                                    <div className={styles['show-left-name']}>
                                      【{res.smallNodeName}】
                                    </div>
                                    <div>待办：{res.agendaCause || '-'}</div>
                                    <div>
                                      <Tag color={res.signColor}>{res.overTimeRemark}</Tag>
                                    </div>
                                  </div>
                                  <div className={styles['show-right']}>
                                    <div>
                                      开始时间：
                                      {moment(res.startDate).format('YYYY-MM-DD HH:mm:ss')}
                                    </div>
                                    <div>
                                      结束时间：
                                      {res.endDate
                                        ? moment(res.endDate || now).format('YYYY-MM-DD HH:mm:ss')
                                        : '处理中'}
                                    </div>
                                    <div>{timeDiff(res.startDate, res.endDate || now)}</div>
                                  </div>
                                </div>
                                <TableShowMessage dataSource={res.nodeMessageList} />
                              </>
                            );
                          }
                        }
                      })}
                    </div>
                  );
                })
              ) : (
                <div className={styles['small-nodes-title']}>
                  <Empty />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShowBoxTable({ columns, dataSource }) {
  const [now] = useState(new Date());
  const newColumns = intoChild(columns, (smallNode, row) => {
    if (regTimec.test(smallNode.startDate)) {
      smallNode.startDate = moment(parseInt(smallNode.startDate)).format('YYYY-MM-DD HH:mm:ss');
    }
    if (regTimec.test(smallNode.endDate)) {
      smallNode.endDate = moment(parseInt(smallNode.endDate)).format('YYYY-MM-DD HH:mm:ss');
    }

    if (smallNode === '-') {
      return smallNode;
    }
    const t = typeof smallNode;
    if (t === 'string' || t === 'number') {
      return smallNode;
    }

    return (
      <>
        <Popover
          content={
            <>
              {smallNode.smallNodeList &&
                smallNode.smallNodeList.map((res, index) => {
                  return (
                    <Fragment key={index}>
                      <Row style={{ fontSize: '12px', width: '450px' }}>
                        <Col span={10}>{res.smallNodeName}</Col>
                        <Col span={14}>
                          {' 【' + moment(res.smallNodeStartDate).format('YYYY-MM-DD HH:mm:ss')}{' '}
                          <span style={{ color: res.smallNodeEndDate ? '' : 'red' }}>
                            -{' '}
                            {res.smallNodeEndDate
                              ? moment(res.smallNodeEndDate || now).format('YYYY-MM-DD HH:mm:ss')
                              : '处理中'}{' '}
                            】
                          </span>
                        </Col>
                      </Row>
                    </Fragment>
                  );
                })}
            </>
          }
        >
          <div
            style={
              row.lastNode && row.lastNode === smallNode?.nodeName
                ? { border: '2px solid rgb(245, 61, 113)', textAlign: 'center' }
                : { textAlign: 'center' }
            }
          >
            <div style={{ textAlign: 'center' }}>
              {smallNode.startDate &&
              timeDiff(smallNode.startDate, smallNode.endDate || now, false) < '0时1分0秒'
                ? '0时1分'
                : timeDiff(smallNode.startDate, smallNode.endDate || now, true) === '0时0分'
                ? ''
                : timeDiff(smallNode.startDate, smallNode.endDate || now, true)}
            </div>
            {smallNode.overTimeRemark && (
              <Tag style={{ marginBottom: '2px' }} color={smallNode.signColor}>
                {smallNode.overTimeRemark}
              </Tag>
            )}
          </div>
        </Popover>
      </>
    );
  });
  console.log(dataSource);

  return (
    <>
      <div
        style={{
          width: '100%',
          padding: '8px 0',
          overflow: 'hide',
          backgroundColor: '#fff',
        }}
      >
        <ProTable
          dataSource={[dataSource]}
          bordered
          search={false}
          defaultSize="small"
          scroll={{ x: 100 }}
          sticky
          columns={newColumns}
        />
      </div>
    </>
  );
}

export default function ShwoBox({ data }) {
  console.log(data);
  if (data.type === 1) return <ShowBoxList data={data?.fullLinkSourceCodeVo} />;
  if (data.type === 2)
    return <ShowBoxTable columns={data?.zongheHead} dataSource={data?.zongheRecords} />;
  return <>未知</>;
}
