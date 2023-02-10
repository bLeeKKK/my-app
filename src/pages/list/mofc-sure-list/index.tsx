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

// mofc状态 初始,接单中,已接单,已出库,已揽件,部分签收,已拒签,已签收,取消中,已取消
const STATUS_OPTIONS = {
  ['初始']: { text: '初始', status: '初始' },
  ['已派单']: { text: '已派单', status: '已派单' },
  ['接单中']: { text: '接单中', status: '接单中' },
  ['已接单']: { text: '已接单', status: '已接单' },
  ['已出库']: { text: '已出库', status: '已出库' },
  ['已揽件']: { text: '已揽件', status: '已揽件' },
  ['部分签收']: { text: '部分签收', status: '部分签收' },
  ['已拒签']: { text: '已拒签', status: '已拒签' },
  ['已签收']: { text: '已签收', status: '已签收' },
  ['取消中']: { text: '取消中', status: '取消中' },
  ['已取消']: { text: '已取消', status: '已取消' },
};

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
    { title: 'EBOC状态', dataIndex: 'ebocStatus', width: 140 },
    {
      title: 'MOFC删除标记',
      dataIndex: 'mofcDelFlag',
      width: 140,
      valueEnum: {
        0: { text: '否', status: '0' },
        1: { text: '是', status: '1' },
      },
    },
    { title: 'MOFC发货编号', dataIndex: 'mofcFhNo', width: 140 },
    { title: 'MOFC单据号', dataIndex: 'mofcLNo', width: 140 },
    { title: 'MOFC状态编号', dataIndex: 'mofcStatus', width: 140 },
    {
      title: 'MOFC状态',
      dataIndex: 'serverStatus',
      width: 140,
      valueEnum: STATUS_OPTIONS,
      valueType: 'select',
    },
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
