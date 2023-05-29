import React from 'react';
import type {ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {findByPage} from './service';
import type {TableListItem, TableListPagination} from './data';
// import Edit, { STATUS_OPTIONS } from './components/Edit';
import {useSelector} from 'umi';
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

// 异常标识:0.正常1、物流计划对应的所有物流订单行项数量汇总大于计划行项-作废数量【异常】 2、服务工单行项汇总数量大于计划行项-作废数量【异常】3、USO状态为初始或作废，MOFC有数据并且工单不属于删除状态【异常】。
const YCBS_OPTIONS = {
  ['0']: {text: '正常', status: "0"},
  ['1']: {text: '物流计划对应的所有物流订单行项数量汇总大于计划行项-作废数量', status: "1"},
  ['2']: {text: '服务工单行项汇总数量大于计划行项-作废数量', status: "2"},
  ['3']: {text: 'USO状态为初始或作废，MOFC有数据并且工单不属于删除状态', status: "3"},
};

const UsoMofcDzList: React.FC = () => {
  const {actionRef} = useSelector((state) => state.accountManagement);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '异常标识', dataIndex: 'ycbs',
      width: 260,
      valueEnum: YCBS_OPTIONS,
      valueType: 'select',
    },
    {title: 'uso订单号', dataIndex: 'usoDdH', width: 100},
    {title: '下游L单号', dataIndex: 'lrpId', width: 100},
    {title: '下游L行项', dataIndex: 'lrpItemId', width: 100},
    {title: 'uso明细行号', dataIndex: 'usoDdMxh', width: 100},
    {title: 'uso订单数量', dataIndex: 'usoSl', width: 100},
    {title: '物流计划号', dataIndex: 'planOrderkey', width: 100},
    {title: '物流计划行项号', dataIndex: 'planLineno', width: 120},
    {title: '计划单数量', dataIndex: 'planOrderQty', width: 100},
    {title: '未清数量', dataIndex: 'openNumber', width: 80},
    {title: '订单数量', dataIndex: 'orderNumber', width: 80},
    {title: '工单签收数量', dataIndex: 'operationQty', width: 100},
    {title: '工单未签收数量', dataIndex: 'unoperationQty', width: 120},
    {title: '工单拒签数量', dataIndex: 'rejectQty', width: 100},
    {title: '工单数量', dataIndex: 'workOrderQty', width: 80},
  ];

  return (
    <ProTable<TableListItem, TableListPagination>
      headerTitle="查询表格"
      actionRef={actionRef}
      rowKey="key"
      search={{labelWidth: 120}}
      // toolBarRender={() => [<Edit key="eidt" />]}
      sticky
      scroll={{x: 1500}}
      // pagination={{
      //   pageSize: 30,
      // }}
      request={async (params) => {
        const {current, pageSize, ...reset} = params;
        // console.log('params', params);
        const {success, data} = await findByPage({
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
  );
};

export default UsoMofcDzList;
