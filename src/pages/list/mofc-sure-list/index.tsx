import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findByPage } from './service';
import type { TableListItem, TableListPagination } from './data';
// import Edit, { STATUS_OPTIONS } from './components/Edit';
import { useSelector } from 'umi';
import moment from 'moment';

// const history = useHistory();
// const item = {id:1,name:"zora"}
// // 路由跳转
// history.push(`/user/role/detail`, { id: item });
// // 参数获取
// const {state} = useLocation()
// console.log(state)  // {id:1,name:"zora"}

function getHaveTDate(arr: any[]) {
  return [
    moment(arr[0]).format('YYYY-MM-DD HH:mm:ss'),
    moment(arr[1]).format('YYYY-MM-DD HH:mm:ss'),
  ];
}

const MofcSureList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.accountManagement);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'EBOC创建时间',
      dataIndex: 'ebocCreateDate',
      width: 200,
      search: false,
      fixed: true,
      valueType: 'dateTime',
    },
    {
      title: 'EBOC创建时间',
      key: 'ebocCreateDates',
      dataIndex: 'ebocCreateDates',
      valueType: 'dateTimeRange',
      hideInTable: true,
      search: {
        transform: (value: any) => ({
          ebocCreateDates: getHaveTDate(value),
        }),
      },
    },
    { title: 'EBOC发货编号', dataIndex: 'ebocFhNo', width: 140 },
    { title: 'EBOC单据号', dataIndex: 'ebocLNo', width: 140 },
    { title: 'MOFC发货编号', dataIndex: 'mofcFhNo', width: 140 },
    { title: 'MOFC单据号', dataIndex: 'mofcLNo', width: 140 },
    { title: 'MOFC状态编号', dataIndex: 'mofcStatus', width: 140 },
    { title: 'MOFC状态', dataIndex: 'serverStatus', width: 140 },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{ labelWidth: 120 }}
        // toolBarRender={() => [<Edit key="eidt" />]}
        sticky
        // scroll={{ x: 1500 }}
        // pagination={{
        //   pageSize: 30,
        // }}
        request={async (params) => {
          const { current, pageSize, ...reset } = params;
          console.log('params', params);
          const { success, data } = await findByPage({
            current,
            size: pageSize,
            ...reset,
          });
          return {
            success: success,
            data: data.records,
            total: data.total,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default MofcSureList;
