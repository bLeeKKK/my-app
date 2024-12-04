import React, { useRef, useState, Fragment } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
// import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { exportAgingReport, getAgingReport } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import { Tag, Popover, Row, Col, Button, Modal, message } from 'antd';
import styles from './styles.less';
// import Trend from '@/components/Trend';
import moment from 'moment';
import MyAccess from '@/components/MyAccess';
import { download } from '@/utils';

let searchData = {};
// 不需要处理小节点的
// const arrExtar = ['sourceCode','finish'];
// 处理小节点渲染
function intoChild(arr, render) {
  const newArr = arr.map((res) => {
    // 不处理字段
    if (res.dataIndex === 'sourceCode') return { ...res, fixed: 'left', width: '100px' };
    if (res.dataIndex === 'finish' || res.dataIndex === 'transType')
      return { ...res, width: '100px' };

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
  const [newColumns, setNodeColumns] = useState([]);
  const ref = useRef();
  // const [now, setNow] = useState(new Date());

  // useRafInterval(() => {
  //   setNow(new Date());
  // }, 1000);

  const formatData = (data) => {
    const temp = [];
    data.forEach((element) => {
      if (element.title === '文件下载地址') {
        temp.push({
          ...element,
          hideInSearch: true,
          render: (t) => {
            return <a href={t}>下载</a>;
          },
        });
      } else {
        element.hideInSearch = true;
        temp.push(element);
      }
    });

    temp.forEach((e, i) => {
      if (e.title === 'uso单号') {
        temp[i].fixed = true;
      }
    });
    console.log(temp);
    return temp;
  };
  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      // search={{ labelWidth: 120 }}
      toolBarRender={() => []}
      tableClassName={styles['base-node-time-list']}
      headerTitle="查询表格"
      actionRef={actionRef}
      rowKey="sourceCode"
      bordered
      sticky
      scroll={{ x: '100px' }}
      formRef={ref}
      request={async (params, sort) => {
        searchData = params;
        if (params.createdDates && params.createdDates?.[0] && params.createdDates?.[1]) {
          params.createdDates = [
            moment(params.createdDates[0]).format('YYYY-MM-DDTHH:mm:ss'),
            moment(params.createdDates[1]).format('YYYY-MM-DDTHH:mm:ss'),
          ];
        } else {
          // delete params.createdDates;
          //默认为最近30天
          params.createdDates = [
            moment().subtract(30, 'days').format('YYYY-MM-DDTHH:mm:ss'),
            moment().format('YYYY-MM-DDTHH:mm:ss'),
          ];
        }
        const { data, success } = await getAgingReport(params, sort);
        data.headerData = formatData(data.headerData);
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
