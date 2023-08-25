import React from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findByPage } from './service';
import type { TableListItem, TableListPagination } from './data';

const YES_NO_OPTIONS = {
  ['Y']: { text: '是', status: 'Y' },
  ['N']: { text: '否', status: 'N' },
};
const STATUS_OPTIONS = {
  ['0']: { text: '初始', status: '0' },
  ['-1']: { text: '无效', status: '-1' },
};
const HEAD_STATUS = {
  ['-1']: { text: '关闭', status: '-1' },
  ['0']: { text: '初始', status: '0' },
  ['1']: { text: '发布完成', status: '1' },
  ['2']: { text: '发布失败', status: '2' },
  ['3']: { text: '部分终止', status: '3' },
  ['4']: { text: '全部终止', status: '4' },
  ['5']: { text: '锁定完成', status: '5' },
  ['6']: { text: '发运完成', status: '6' },
};

const ScmcMofcCompareAccountOfAllocateList: React.FC = () => {
  const columns: ProColumns<TableListItem>[] = [
    { title: 'scmc调拨行项id', dataIndex: 'id', width: 100, hideInTable: true, hideInSearch: true },
    { title: 'scmc调拨单号', dataIndex: 'planSignNo', width: 100 },
    { title: 'scmc调拨行项号', dataIndex: 'lineNumber', width: 100 },
    { title: 'scmc真实有效数量', dataIndex: 'scmcEffectiveQty', width: 100 },
    { title: '来源行号', dataIndex: 'sourceLineNo', width: 100 },
    { title: '计划数量', dataIndex: 'planAmount', width: 100, hideInSearch: true },
    { title: '有效数量', dataIndex: 'effectiveAmount', width: 100, hideInSearch: true },
    { title: 'uso订单数量', dataIndex: 'orderAmount', width: 100, hideInSearch: true },
    { title: '终止数量', dataIndex: 'cancelAmount', width: 100, hideInSearch: true },
    { title: '发货数量', dataIndex: 'dispatchAmount', width: 100, hideInSearch: true },
    { title: '收货数量', dataIndex: 'receiveAmount', width: 100, hideInSearch: true },
    {
      title: 'scmc状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: STATUS_OPTIONS,
      valueType: 'select',
    },
    {
      title: 'scmc状态描述',
      dataIndex: 'statusDes',
      width: 100,
      hideInTable: true,
      hideInSearch: true,
    },
    { title: 'mofc来源单号', dataIndex: 'mofcExternOrderkey', width: 100 },
    { title: 'mofc来源订单行项号', dataIndex: 'mofcExternLineno', width: 100 },
    { title: 'mofc计划数量', dataIndex: 'mofcExternQty', width: 100, hideInSearch: true },
    { title: 'mofc订单数量', dataIndex: 'mofcOrderQty', width: 100, hideInSearch: true },
    { title: 'mofc签收数量', dataIndex: 'mofcSignQty', width: 100, hideInSearch: true },
    { title: 'mofc拒签数量', dataIndex: 'mofcRejectQty', width: 100, hideInSearch: true },
    { title: 'mofc出库数量', dataIndex: 'mofcShipAccountQty', width: 100, hideInSearch: true },
    { title: 'mofc入库数量', dataIndex: 'mofcReceiveAccountQty', width: 100, hideInSearch: true },
    { title: 'mofc正品数量', dataIndex: 'mofcGoodQty', width: 100, hideInSearch: true },
    { title: 'mofc机损数量', dataIndex: 'mofcMachineDamageQty', width: 100, hideInSearch: true },
    { title: 'mofc箱损数量', dataIndex: 'mofcBoxDamageQty', width: 100, hideInSearch: true },
    {
      title: '2个系统的数量是否有异常',
      dataIndex: 'ifAbnormalOfTwoSysQty',
      width: 100,
      valueEnum: YES_NO_OPTIONS,
      valueType: 'select',
    },
    {
      title: 'mofc订单数量是否有异常',
      dataIndex: 'ifAbnormalOfOrderQty',
      width: 100,
      valueEnum: YES_NO_OPTIONS,
      valueType: 'select',
    },
    {
      title: 'mofc签收数量是否有异常',
      dataIndex: 'ifAbnormalOfSignQty',
      width: 100,
      valueEnum: YES_NO_OPTIONS,
      valueType: 'select',
    },
    {
      title: 'mofc出库数量是否有异常',
      dataIndex: 'ifAbnormalOfShipAccountQty',
      width: 100,
      valueEnum: YES_NO_OPTIONS,
      valueType: 'select',
    },
    {
      title: 'mofc入库数量是否有异常',
      dataIndex: 'ifAbnormalOfReceiveAccountQty',
      width: 100,
      valueEnum: YES_NO_OPTIONS,
      valueType: 'select',
    },
    {
      title: 'mofc损坏数量是否有异常',
      dataIndex: 'ifAbnormalOfDamageQty',
      width: 100,
      valueEnum: YES_NO_OPTIONS,
      valueType: 'select',
    },
    {
      title: '对账是否结束',
      dataIndex: 'ifEnd',
      width: 100,
      valueEnum: YES_NO_OPTIONS,
      valueType: 'select',
    },
    {
      title: 'scmc调拨头状态',
      dataIndex: 'headStatus',
      width: 100,
      valueEnum: HEAD_STATUS,
      valueType: 'select',
    },
    { title: '服务类型', dataIndex: 'serviceTypeCode', width: 100, hideInSearch: true },
    { title: '发货库位代码', dataIndex: 'stockLocationCode', width: 100, hideInSearch: true },
    { title: '收货库位代码', dataIndex: 'dstStockCode', width: 100, hideInSearch: true },
  ];

  return (
    <ProTable<TableListItem, TableListPagination>
      headerTitle="查询表格"
      rowKey="id"
      search={{ labelWidth: 200 }}
      sticky
      scroll={{ x: 1500 }}
      request={async (params) => {
        const { current, pageSize, ...reset } = params;
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
  );
};

export default ScmcMofcCompareAccountOfAllocateList;
