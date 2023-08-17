import React from 'react';
import type {ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {findByPage} from './service';
import type {TableListItem, TableListPagination} from './data';

const YES_NO_OPTIONS = {
  ['Y']: {text: '是', status: 'Y'},
  ['N']: {text: '否', status: 'N'},
};

const ScmcMofcCompareAccountOfAllocateList: React.FC = () => {
  const columns: ProColumns<TableListItem>[] = [
    {title: 'scmc调拨行项id', dataIndex: 'id', width: 100},
    {title: 'scmc调拨单号', dataIndex: 'planSignNo', width: 100},
    {title: 'scmc调拨行项号', dataIndex: 'lineNumber', width: 100},
    {title: '来源行号', dataIndex: 'sourceLineNo', width: 100},
    {title: '计划数量', dataIndex: 'planAmount', width: 100, hideInSearch: true},
    {title: '有效数量', dataIndex: 'effectiveAmount', width: 100, hideInSearch: true},
    {title: 'uso订单数量', dataIndex: 'orderAmount', width: 100, hideInSearch: true},
    {title: '终止数量', dataIndex: 'cancelAmount', width: 100, hideInSearch: true},
    {title: '发货数量', dataIndex: 'dispatchAmount', width: 100, hideInSearch: true},
    {title: '收货数量', dataIndex: 'receiveAmount', width: 100, hideInSearch: true},
    {title: 'scmc状态', dataIndex: 'status', width: 100},
    {title: 'scmc状态描述', dataIndex: 'statusDes', width: 100},
    {title: 'mofc来源单号', dataIndex: 'mofcExternOrderkey', width: 100},
    {title: 'mofc来源订单行项号', dataIndex: 'mofcExternLineno', width: 100},
    {title: 'mofc计划数量', dataIndex: 'mofcExternQty', width: 100, hideInSearch: true},
    {title: 'mofc订单数量', dataIndex: 'mofcOrderQty', width: 100, hideInSearch: true},
    {title: 'mofc签收数量', dataIndex: 'mofcSignQty', width: 100, hideInSearch: true},
    {title: 'mofc拒签数量', dataIndex: 'mofcRejectQty', width: 100, hideInSearch: true},
    {title: 'mofc出库数量', dataIndex: 'mofcShipAccountQty', width: 100, hideInSearch: true},
    {title: 'mofc入库数量', dataIndex: 'mofcReceiveAccountQty', width: 100, hideInSearch: true},
    {title: 'mofc正品数量', dataIndex: 'mofcGoodQty', width: 100, hideInSearch: true},
    {title: 'mofc机损数量', dataIndex: 'mofcMachineDamageQty', width: 100, hideInSearch: true},
    {title: 'mofc箱损数量', dataIndex: 'mofcBoxDamageQty', width: 100, hideInSearch: true},
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
  ];

  return (
    <ProTable<TableListItem, TableListPagination>
      headerTitle="查询表格"
      rowKey="id"
      search={{labelWidth: 120}}
      sticky
      scroll={{x: 1500}}
      request={async (params) => {
        const {current, pageSize, ...reset} = params;
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

export default ScmcMofcCompareAccountOfAllocateList;
