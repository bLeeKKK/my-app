import React, { useRef, useState, Fragment } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
// import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { zonghe, interfaceCallRecordExport } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import moment from 'moment';
import { Button, Modal, message, Popover, Row, Col } from 'antd';
import { download } from '@/utils';
import { Tag } from 'antd';
import { useRafInterval } from 'ahooks';
import { timeDiff } from '@/utils';
import './style.less';

let searchData = {};

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
    if (res.dataIndex.includes('.currentCode1')) {
      return {
        ...res,
        width: '100px',
        render: (_, record) => {
          return getDeepObj(record, res.dataIndex);
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
  const ref = useRef();
  const [now, setNow] = useState(new Date());

  useRafInterval(() => {
    setNow(new Date());
  }, 1000);

  const newColumns = intoChild(nodeColumns, (smallNode) => {
    console.log(smallNode);

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
            // <>

            //   <div>开始时间：{moment(smallNode.startDate).format('YYYY-MM-DD HH:mm:ss')}</div>
            //   <div style={{ color: smallNode.endDate ? '' : 'red' }}>
            //     结束时间：
            //     {smallNode.endDate
            //       ? moment(smallNode.endDate || now).format('YYYY-MM-DD HH:mm:ss')
            //       : '处理中'}
            //   </div>
            // </>
          }
        >
          <div>{timeDiff(smallNode.startDate, smallNode.endDate || now, true)}</div>
          {/* <div>待办：{smallNode.agendaCause || '-'}</div> */}
          <Tag color={smallNode.signColor}>{smallNode.overTimeRemark}</Tag>
        </Popover>
      </>
    );
  });

  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      headerTitle="查询表格"
      actionRef={actionRef}
      rowKey="sourceCode"
      search={{ labelWidth: 120 }}
      // expandable={{
      //   expandedRowRender,
      // }}
      toolBarRender={() => [
        <Button
          key="export"
          onClick={() => {
            Modal.confirm({
              title: '提示',
              content: '确定要导出数据吗？',
              onOk: () => {
                // const data = ref.current?.getFieldsValue();
                interfaceCallRecordExport(searchData)
                  .then((res) => {
                    const blob = new Blob([res], {
                      type: 'application/vnd.ms-excel,charset=utf-8',
                    });
                    const fileName = `记录池数据${moment().format('YYYYMMDDHHmmss')}.xlsx`;
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
        </Button>,
      ]}
      sticky
      // style={{backgroundColor:'red'}}
      className="contolTable"
      bordered
      scroll={{ x: 100 }}
      formRef={ref}
      request={async (params, sort) => {
        searchData = params;
        const { success, data } = await zonghe(params, sort);
        setNodeColumns(data?.headerData || []);
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
