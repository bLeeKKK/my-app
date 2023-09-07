import React, { useRef, useState, Fragment } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
// import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { zonghe, exportZonghe3 } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector, useLocation } from 'umi';
import moment from 'moment';
import {Tag, Popover, Badge, Descriptions, Button, Modal, message} from 'antd';
import { download,timeDiff } from '@/utils';
import TableShowMessage from '@/components/TableShowMessage';
import MyAccess from "@/components/MyAccess";

let searchData = {};
const regTimec = /^\d{10,13}$/;

// 不需要处理小节点的
const arrExtar = ['sourceCode', 'currentCode'];
const getDeepObj = (obj, path = '') => {
  const pathArr = path.split('.');
  let res = obj;
  pathArr.forEach((item) => {
    res = res?.[item];
  });
  return res;
};
// 处理小节点渲染
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

// const expandedRowRender = (data) => <ShowBox data={data} />;

// const now = new Date();
const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.baseShowList);
  const [nodeColumns, setNodeColumns] = useState([]);
  const [nodeRecords, setNodeRecords] = useState([]);
  const ref = useRef();
  const [now, setNow] = useState(new Date());
  const { query } = useLocation();

  // useRafInterval(() => {
  //   setNow(new Date());
  // }, 1000);

  const newColumns = intoChild(nodeColumns, (smallNode, row) => {
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
                      <Descriptions style={{ width: '420px', fontSize: '12px' }} size="small">
                        <Descriptions.Item
                          style={{ paddingBottom: res?.nodeMessage?.length ? '8px' : '0' }}
                          label={res.smallNodeName}
                          span={24}
                        >
                          {moment(res.smallNodeStartDate).format('YYYY-MM-DD HH:mm:ss')}-
                          {res.smallNodeEndDate ? (
                            moment(res.smallNodeEndDate || now).format('YYYY-MM-DD HH:mm:ss')
                          ) : (
                            <>
                              <span style={{ color: res.smallNodeEndDate ? '' : 'red' }}>
                                处理中
                              </span>
                            </>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                      {res?.nodeMessageList?.length ? (
                        <TableShowMessage dataSource={res.nodeMessageList} />
                      ) : null}
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
            <Badge
              count={
                smallNode.smallNodeList?.reduce(
                  (pre: any[], item) => pre.concat(item.nodeMessageList || []),
                  [],
                ).length
              }
              size='small'
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
            </Badge>
          </div>
        </Popover>
      </>
    );
  });
  const formatData = (data) => {
    const temp = [];
    data.forEach((element) => {
      if (element.title === '完成状态') {
        element.valueEnum = { true: { text: '完成' }, false: { text: '未完成' } };
        temp.push(element);
      } else if (element.title === '大节点代码') {
        const t = {};
        element.children.forEach((e) => {
          t[typeof e.dataIndex === 'string' ? e.dataIndex : e.dataIndex[0]] = { text: e.title };
        });
        element.valueEnum = t;
        element.fieldProps = {
          mode: 'multiple',
        };
        temp.push(element);
      } else if (element.title === '预警等级') {
        const t = {};
        element.children.forEach((e) => {
          t[e.dataIndex] = { text: e.title };
        });
        element.valueEnum = t;
        element.fieldProps = {
          mode: 'multiple',
        };
        temp.push(element);
      } else if (element.title === '开始时间') {
        element.dataIndex = 'startDates';
        element.valueType = 'dateTimeRange';
        element.fieldProps = {
          onChange: () => {
            console.log(111);
          },
        };
        temp.push(element);
      } else {
        temp.push(element);
      }
    });

    temp.forEach((e, i) => {
      if (e.title === '业务节点') {
        e.children.forEach((ee, ii) => {
          if (ee.title === '订单号') {
            temp[i].children[ii].fixed = true;
            const temp2 = JSON.parse(JSON.stringify(temp[i].children[ii]));
            temp[i].children.splice(ii, 1);
            temp.splice(1, 0, temp2);
          }
        });
      } else if (e.title === '运输方式') {
        temp[i].fixed = true;
      }
    });
    temp.push({
      title: '订单类型集合',
      dataIndex: 'orderTypes',
      hideInTable: true,
      valueEnum: {
        '1': {
          text: '标准订单',
        },
        '2': {
          text: '工程订单',
        },
        '3': {
          text: '样机售出订单',
        },
        '4': {
          text: '样机发出订单',
        },
        '5': {
          text: '样机取回订单',
        },
        '6': {
          text: '寄售售出订单',
        },
        '7': {
          text: '寄售发出订单',
        },
        '8': {
          text: '寄售取回订单',
        },
        '9': {
          text: '退货订单',
        },
        '10': {
          text: '贷项订单',
        },
        '11': {
          text: '买断样机订单',
        },
        '12': {
          text: '售中机销售订单',
        },
      },
      fieldProps: {
        mode: 'multiple',
      },
    });
    return temp;
  };

  const formatRecord = (data) => {
    let classKey = 1;
    let findKey = false;
    data.forEach((e) => {
      e.children &&
        e.children.forEach((ee) => {
          if (e.orderNo === ee.orderNo) ee.orderNo = '';
          e.classKey = classKey;
          ee.classKey = classKey;
          findKey = true;
        });
      if (findKey) {
        classKey === 2 ? (classKey = 1) : classKey++;
        findKey = false;
      }
    });
    return data;
  };
  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      actionRef={actionRef}
      rowKey="sourceCode"
      search={query.search === 'false' ? false : { labelWidth: 120 }}
      toolBarRender={() => [
        <MyAccess aKey="list:base-report-forms:export" key="export">
          <Button
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  content: '确定要导出数据吗？',
                  onOk: () => {
                    // const data = ref.current?.getFieldsValue();
                    exportZonghe3(searchData)
                        .then((res) => {
                          const blob = new Blob([res], {
                            type: 'application/vnd.ms-excel,charset=utf-8',
                          });
                          const fileName = `综合报表（b端）${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                          download(blob, fileName);
                        })
                        .catch((err) => {
                          message.error(err.message);
                        });
                  },
                });
              }}
          >
            导出报表
          </Button>
        </MyAccess>,
      ]}
      defaultSize="small"
      sticky
      className="contolTable"
      rowClassName={(record) => {
        if (record.classKey) {
          if (record.classKey === 1) {
            return 'clumStyle1';
          } else if (record.classKey === 2) {
            return 'clumStyle2';
          }
          return '';
        }
      }}
      bordered
      scroll={{ x: 100 }}
      formRef={ref}
      request={async (params, sort) => {
        searchData = params;
        if (
          params.startDates &&
          params.startDates?.[0] &&
          params.startDates?.[1] &&
          Array.isArray(params.startDate)
        ) {
          params.startDates = [
            moment(params.startDates[0]).format('YYYY-MM-DDTHH:mm:ss'),
            moment(params.startDates[1]).format('YYYY-MM-DDTHH:mm:ss'),
          ];
        } else {
          delete params.startDates;
        }

        params.createdDates = ['2022-11-01T00:00:00', moment().format('YYYY-MM-DDTHH:mm:ss')];
        if (query.filiale) params.filialeList = query.filiale.split(',');

        const { success, data } = await zonghe(params, sort);
        data.headerData = formatData(data.headerData);
        data.records = formatRecord(data.records);
        setNodeColumns(data?.headerData || []);
        setNodeRecords(data?.records || []);
        return {
          success: success,
          data: data.records,
          total: data.total,
          // intfStDatetimes: ['2022-11-11T10:33:41.436', '2022-11-30T10:33:41.436'],
        };
      }}
      pagination={{
        showSizeChanger: true,
      }}
      columns={newColumns}
    />
    // </PageContainer>
  );
};

export default TableList;
