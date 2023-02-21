import React, { useRef, useState, Fragment } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
// import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getAgingReport, zonghe } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import { Tag, Popover } from 'antd';
import styles from './styles.less';
import Trend from '@/components/Trend';

// 不需要处理小节点的
const arrExtar = ['sourceCode'];
// 处理小节点渲染
function intoChild(arr, render) {
  const newArr = arr.map((res) => {
    // 不处理字段
    if (arrExtar.includes(res.dataIndex)) return { ...res, fixed: 'left' };

    res.dataIndex = Array.isArray(res?.dataIndex)
      ? res.dataIndex
      : res?.dataIndex?.split?.('.') || res.dataIndex;
    if (res.children && res.children.length) {
      res.children = intoChild(res.children, render);
      return {
        ...res,
      };
    }

    // 最小节点
    return {
      ...res,
      render,
      width: '200px',
    };
  });

  return newArr;
}

function getColor(aging = '') {
  // 正常（绿色），一般预警（蓝色），较重预警（黄色），严重预警(橙色），特别严重预警（红色）
  if (aging.includes('正常')) {
    return 'green';
  } else if (aging.includes('一般预警')) {
    return 'blue';
  } else if (aging.includes('较重预警')) {
    return 'yellow';
  } else if (aging.includes('严重预警')) {
    return 'orange';
  } else if (aging.includes('特别严重预警')) {
    return 'red';
  }
}

// const expandedRowRender = (data) => <ShowBox data={data} />;
// const now = new Date();
const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.baseNodeTimeList);
  const [nodeColumns, setNodeColumns] = useState([]);
  const ref = useRef();
  // const [now, setNow] = useState(new Date());

  // useRafInterval(() => {
  //   setNow(new Date());
  // }, 1000);

  const newColumns = intoChild(nodeColumns, (smallNode) => {
    if (smallNode === '-') {
      return smallNode;
    }
    const t = typeof smallNode;
    if (t === 'string' || t === 'number') {
      return smallNode;
    }

    const names = smallNode?.smallNodeName || [];
    const times = smallNode?.smallNodeTime || [];
    return (
      <>
        {/* <Popover
          content={
            <>
              {names.map((res, index) => {
                return (
                  <Fragment key={index}>
                    <div style={{ fontSize: '12px' }}>
                      {res}：{times[index]}分钟
                    </div>
                  </Fragment>
                );
              })}
            </>
          }
        >
          {smallNode?.aging ? (
            <div style={{ whiteSpace: 'nowrap' }}>
              {smallNode?.agingTime}{' '}
              <Tag color={getColor(smallNode?.aging)}>{smallNode?.aging}</Tag>
            </div>
          ) : (
            !!names?.length && <Tag>处理中</Tag>
          )}
        </Popover> */}
        <Popover
          content={
            <>
              {names.map((res, index) => {
                return (
                  <Fragment key={index}>
                    <div style={{ fontSize: '12px' }}>
                      {res}：{times[index]}分钟
                    </div>
                  </Fragment>
                );
              })}
            </>
          }
        >
          <div style={{ display: 'flex' }}>
            <div>
              {names.length
                ? names.map((res, index) => {
                    return (
                      <div
                        style={{
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '110px',
                        }}
                        key={res + index}
                      >
                        {times[index]}：{res}
                      </div>
                    );
                  })
                : '-----'}
            </div>
            <div style={{ borderLeft: '1px solid rgb(232, 232, 232)', paddingLeft: '4px' }}>
              {names?.length ? (
                <Trend flag="up" style={{ marginRight: 16 }}>
                  月同比
                  <span className={styles.trendText}>12%</span>
                </Trend>
              ) : null}
              {smallNode?.aging ? (
                <div style={{ whiteSpace: 'nowrap' }}>
                  <Tag color={getColor(smallNode?.aging)}>{smallNode?.aging}</Tag>
                  <div>总：{smallNode?.agingTime}分钟</div>
                </div>
              ) : (
                !!names?.length && <Tag>处理中</Tag>
              )}
            </div>
          </div>
        </Popover>
      </>
    );
  });

  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      // search={{ labelWidth: 120 }}
      search={false}
      tableClassName={styles['base-node-time-list']}
      headerTitle="查询表格"
      actionRef={actionRef}
      rowKey="sourceCode"
      // expandable={{
      //   expandedRowRender,
      // }}
      // toolBarRender={() => [
      //   <Button
      //     key="export"
      //     onClick={() => {
      //       Modal.confirm({
      //         title: '提示',
      //         content: '确定要导出数据吗？',
      //         onOk: () => {
      //           // const data = ref.current?.getFieldsValue();
      //           interfaceCallRecordExport(searchData)
      //             .then((res) => {
      //               const blob = new Blob([res], {
      //                 type: 'application/vnd.ms-excel,charset=utf-8',
      //               });
      //               const fileName = `记录池数据${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      //               download(blob, fileName);
      //             })
      //             .catch((err) => {
      //               message.error(err.message);
      //             });
      //         },
      //       });
      //     }}
      //   >
      //     导出报表
      //   </Button>,
      // ]}
      bordered
      sticky
      scroll={{ x: '100px' }}
      formRef={ref}
      request={async (params, sort) => {
        const { data, success } = await getAgingReport(params, sort);
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
