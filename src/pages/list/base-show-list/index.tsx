import React, { useRef, useState } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
// import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getAllFullLinkRecordVo, interfaceCallRecordExport } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import moment from 'moment';
import { Button, Modal, message, Popover } from 'antd';
import { download } from '@/utils';
import { Tag } from 'antd';
import { useRafInterval } from 'ahooks';
import { timeDiff } from '@/utils';

let searchData = {};

// 不需要处理小节点的
const arrExtar = ['sourceCode', 'XXX'];
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
      width: '115px',
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
    if (smallNode === '-') {
      return smallNode;
    }
    return (
      <>
        <Popover
          content={
            <>
              <div>开始时间：{moment(smallNode.startDate).format('YYYY-MM-DD HH:mm:ss')}</div>
              <div style={{ color: smallNode.endDate ? '' : 'red' }}>
                结束时间：
                {smallNode.endDate
                  ? moment(smallNode.endDate || now).format('YYYY-MM-DD HH:mm:ss')
                  : '处理中'}
              </div>
            </>
          }
        >
          <div>{timeDiff(smallNode.startDate, smallNode.endDate || now)}</div>
          <div>待办：{smallNode.agendaCause || '-'}</div>
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
      bordered
      scroll={{ x: 5000 }}
      formRef={ref}
      request={async (params, sort) => {
        searchData = params;
        const { success, data } = {
          success: true,
          message: '处理成功！',
          data: {
            records: [
              {
                USO: {
                  USO_AfterSale_B003: {},
                  USO_AfterSale_B002: {},
                  USO_AfterSale_B001: {},
                  endDate: '2023-02-17T11:30:31.223+08:00',
                  USO_AfterSale_B004: {},
                  currentCode: '113158',
                  USO_Order_B006: {
                    USO_Order_B006_S001: {
                      nodeName: '作废',
                      endDate: '系统',
                      nodeCode: 'USO_Order_B006',
                      currentCode: '113158',
                      remark: null,
                      overTimeRemark: '正常',
                      headOffice: '系统',
                      filiale: null,
                      sourceCode: '113158',
                      expectShipTime: '113158',
                      signColor: '#008000',
                      smallNodeCode: 'USO_Order_B006_S001',
                      agendaCause: null,
                      sourceType: null,
                      sourceSys: 'USO',
                      businessDept: null,
                      id: '7e3c3c2ea76e1a772e7787f5ff17b485',
                      overTimeClassId: '正常',
                      remark1: null,
                      deliveryDate: null,
                      smallNodeName: '作废',
                      consumer: '系统',
                      startDate: '2023-02-17T11:30:31.223+08:00',
                      remark2: null,
                    },
                  },
                  USO_Order_B005: {},
                  USO_Order_B004: {},
                  USO_Order_B003: {},
                  USO_Order_B002: {
                    USO_Order_B002_S005: {
                      nodeName: '业务审核',
                      endDate: null,
                      nodeCode: 'USO_Order_B002',
                      currentCode: '113158',
                      remark: null,
                      overTimeRemark: '特别严重预警',
                      headOffice: null,
                      filiale: null,
                      sourceCode: '113158',
                      expectShipTime: '113158',
                      signColor: '#FF0000',
                      smallNodeCode: 'USO_Order_B002_S005',
                      agendaCause: null,
                      sourceType: null,
                      sourceSys: 'USO',
                      businessDept: null,
                      id: 'f86af606ce634484ebe1b4dc1fc303d9',
                      overTimeClassId: '特别严重预警',
                      remark1: null,
                      deliveryDate: null,
                      smallNodeName: '退库审核',
                      consumer: null,
                      startDate: '2023-02-17T10:30:04.393+08:00',
                      remark2: null,
                    },
                    USO_Order_B002_S004: {
                      nodeName: '业务审核',
                      endDate: null,
                      nodeCode: 'USO_Order_B002',
                      currentCode: '113158',
                      remark: null,
                      overTimeRemark: '特别严重预警',
                      headOffice: null,
                      filiale: null,
                      sourceCode: '113158',
                      expectShipTime: '113158',
                      signColor: '#FF0000',
                      smallNodeCode: 'USO_Order_B002_S004',
                      agendaCause: null,
                      sourceType: null,
                      sourceSys: 'USO',
                      businessDept: null,
                      id: '4764e7135ad64b3fc8f69a18b9030b3e',
                      overTimeClassId: '特别严重预警',
                      remark1: null,
                      deliveryDate: null,
                      smallNodeName: '尾货退货审核',
                      consumer: null,
                      startDate: '2023-02-17T10:30:04.393+08:00',
                      remark2: null,
                    },
                  },
                  USO_Order_B001: {
                    USO_Order_B001_S001: {
                      nodeName: '初始',
                      endDate: '尹晓龙',
                      nodeCode: 'USO_Order_B001',
                      currentCode: '113158',
                      remark: null,
                      overTimeRemark: '正常',
                      headOffice: '尹晓龙',
                      filiale: '316',
                      sourceCode: '113158',
                      expectShipTime: '113158',
                      signColor: '#008000',
                      smallNodeCode: 'USO_Order_B001_S001',
                      agendaCause: null,
                      sourceType: null,
                      sourceSys: 'USO',
                      businessDept: '738',
                      id: '60cc278b558baa1deec45360cce060a6',
                      overTimeClassId: '正常',
                      remark1: null,
                      deliveryDate: null,
                      smallNodeName: '初始',
                      consumer: '尹晓龙',
                      startDate: '2023-02-17T10:30:04.393+08:00',
                      remark2: null,
                    },
                  },
                  sourceSys: 'USO',
                  startDate: '2023-02-17T10:30:04.393+08:00',
                },
                SCMC: { endDate: null, sourceSys: 'SCMC', currentCode: null, startDate: null },
                sourceCode: '113158',
                XXX: '113158',
                MOFC: { endDate: null, sourceSys: 'MOFC', currentCode: null, startDate: null },
                LRP: { endDate: null, sourceSys: 'LRP', currentCode: null, startDate: null },
              },
            ],
            total: 429,
            size: 20,
            current: 1,
            orders: [],
            headerData: [
              { title: '来源单号', dataIndex: 'sourceCode' },
              { title: 'XX单号', dataIndex: 'XXX' },
              {
                title: 'USO',
                dataIndex: 'USO',
                children: [
                  {
                    title: '业务审核',
                    dataIndex: 'USO.currentCode.USO_Order_B002',
                    children: [
                      {
                        title: '尾货退货审核',
                        dataIndex: 'USO.currentCode.USO_Order_B002.USO_Order_B002_S004',
                      },
                      {
                        title: '提货方式更改审核',
                        dataIndex: 'USO.currentCode.USO_Order_B002.USO_Order_B002_S007',
                      },
                      {
                        title: '专供机审核',
                        dataIndex: 'USO.currentCode.USO_Order_B002.USO_Order_B002_S003',
                      },
                      {
                        title: '退库审核',
                        dataIndex: 'USO.currentCode.USO_Order_B002.USO_Order_B002_S005',
                      },
                      {
                        title: '特批',
                        dataIndex: 'USO.currentCode.USO_Order_B002.USO_Order_B002_S001',
                      },
                      {
                        title: '特殊信用申请',
                        dataIndex: 'USO.currentCode.USO_Order_B002.USO_Order_B002_S002',
                      },
                      {
                        title: '异地审核',
                        dataIndex: 'USO.currentCode.USO_Order_B002.USO_Order_B002_S008',
                      },
                      {
                        title: '订单确认',
                        dataIndex: 'USO.currentCode.USO_Order_B002.USO_Order_B002_S006',
                      },
                    ],
                  },
                  {
                    title: '作废',
                    dataIndex: 'USO.currentCode.USO_Order_B006',
                    children: [
                      {
                        title: '作废',
                        dataIndex: 'USO.currentCode.USO_Order_B006.USO_Order_B006_S001',
                      },
                    ],
                  },
                  {
                    title: '订单中心审核',
                    dataIndex: 'USO.currentCode.USO_Order_B004',
                    children: [
                      {
                        title: '订单中心审核',
                        dataIndex: 'USO.currentCode.USO_Order_B004.USO_Order_B004_S001',
                      },
                    ],
                  },
                  {
                    title: '初始',
                    dataIndex: 'USO.currentCode.USO_Order_B001',
                    children: [
                      {
                        title: '按单支付',
                        dataIndex: 'USO.currentCode.USO_Order_B001.USO_Order_B001_S004',
                      },
                      {
                        title: '建议订单确认',
                        dataIndex: 'USO.currentCode.USO_Order_B001.USO_Order_B001_S002',
                      },
                      {
                        title: '大客户订单确认',
                        dataIndex: 'USO.currentCode.USO_Order_B001.USO_Order_B001_S003',
                      },
                      {
                        title: '初始',
                        dataIndex: 'USO.currentCode.USO_Order_B001.USO_Order_B001_S001',
                      },
                    ],
                  },
                  {
                    title: '申请单创建',
                    dataIndex: 'USO.currentCode.USO_AfterSale_B001',
                    children: [
                      {
                        title: '申请单创建',
                        dataIndex: 'USO.currentCode.USO_AfterSale_B001.USO_AfterSale_B001_SOO1',
                      },
                    ],
                  },
                  {
                    title: '派单中',
                    dataIndex: 'USO.currentCode.USO_Order_B005',
                    children: [
                      {
                        title: '订单下发MOFC',
                        dataIndex: 'USO.currentCode.USO_Order_B005.USO_Order_B005_S003',
                      },
                      {
                        title: '补货推送SCMC',
                        dataIndex: 'USO.currentCode.USO_Order_B005.USO_Order_B005_S001',
                      },
                      {
                        title: '退回',
                        dataIndex: 'USO.currentCode.USO_Order_B005.USO_Order_B005_S005',
                      },
                      {
                        title: '订单下发SCMC',
                        dataIndex: 'USO.currentCode.USO_Order_B005.USO_Order_B005_S004',
                      },
                      {
                        title: '补货发货',
                        dataIndex: 'USO.currentCode.USO_Order_B005.USO_Order_B005_S002',
                      },
                    ],
                  },
                  {
                    title: 'USO的申请单审核',
                    dataIndex: 'USO.currentCode.USO_AfterSale_B002',
                    children: [
                      {
                        title: 'USO的申请单审核',
                        dataIndex: 'USO.currentCode.USO_AfterSale_B002.USO_AfterSale_B002_SOO1',
                      },
                    ],
                  },
                  {
                    title: 'USO的鉴定工单审核',
                    dataIndex: 'USO.currentCode.USO_AfterSale_B004',
                    children: [
                      {
                        title: 'USO的鉴定工单审核',
                        dataIndex: 'USO.currentCode.USO_AfterSale_B004.USO_AfterSale_B004_SOO1',
                      },
                    ],
                  },
                  {
                    title: '推送CRM',
                    dataIndex: 'USO.currentCode.USO_AfterSale_B003',
                    children: [
                      {
                        title: '推送CRM',
                        dataIndex: 'USO.currentCode.USO_AfterSale_B003.USO_AfterSale_B003_SOO1',
                      },
                    ],
                  },
                  {
                    title: '业务运营审核',
                    dataIndex: 'USO.currentCode.USO_Order_B003',
                    children: [
                      {
                        title: '业务运营审核',
                        dataIndex: 'USO.currentCode.USO_Order_B003.USO_Order_B003_S001',
                      },
                    ],
                  },
                ],
              },
              {
                title: 'SCMC',
                dataIndex: 'SCMC',
                children: [
                  {
                    title: '期货订单 - 终止',
                    dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B005',
                    children: [
                      {
                        title: '终止申请',
                        dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B005.SCMC_PlanOrder_S05',
                      },
                      {
                        title: '期转现申请',
                        dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B005.SCMC_PlanOrder_S06',
                      },
                    ],
                  },
                  {
                    title: '交货单 - 大节点 - 接入',
                    dataIndex: 'SCMC.currentCode.SCMC_DeliveryOrder_B001',
                    children: [
                      {
                        title: '交货单 - 接入',
                        dataIndex:
                          'SCMC.currentCode.SCMC_DeliveryOrder_B001.SCMC_DeliveryOrder_S001',
                      },
                    ],
                  },
                  {
                    title: '交货单 - 大节点 - 终止审核',
                    dataIndex: 'SCMC.currentCode.SCMC_DeliveryOrder_B005',
                    children: [
                      {
                        title: '终止审核',
                        dataIndex:
                          'SCMC.currentCode.SCMC_DeliveryOrder_B005.SCMC_DeliveryOrder_S003',
                      },
                    ],
                  },
                  {
                    title: '交货单 - 发布',
                    dataIndex: 'SCMC.currentCode.SCMC_DeliveryOrder_B002',
                    children: [
                      {
                        title: '发布',
                        dataIndex:
                          'SCMC.currentCode.SCMC_DeliveryOrder_B002.SCMC_DeliveryOrder_S002',
                      },
                    ],
                  },
                  {
                    title: '期货订单 - 订单归集',
                    dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B003',
                    children: [
                      {
                        title: '订单归集',
                        dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B003.SCMC_PlanOrder_S004',
                      },
                    ],
                  },
                  {
                    title: '期货订单 - 资源匹配',
                    dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B002',
                    children: [
                      {
                        title: '资源匹配',
                        dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B002.SCMC_PlanOrder_S003',
                      },
                    ],
                  },
                  {
                    title: '期货订单 - 期货订单接入',
                    dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B001',
                    children: [
                      {
                        title: '撤销',
                        dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B001.SCMC_PlanOrder_S002',
                      },
                      {
                        title: '接入',
                        dataIndex: 'SCMC.currentCode.SCMC_PlanOrder_B001.SCMC_PlanOrder_S001',
                      },
                    ],
                  },
                ],
              },
              {
                title: 'MOFC',
                dataIndex: 'MOFC',
                children: [
                  {
                    title: '订单创建大节点',
                    dataIndex: 'MOFC.currentCode.MOFC_Order_B003',
                    children: [
                      {
                        title: '订单创建预约小节点',
                        dataIndex: 'MOFC.currentCode.MOFC_Order_B003.MOFC_Order_B003_S002',
                      },
                      {
                        title: '订单创建默认小节点',
                        dataIndex: 'MOFC.currentCode.MOFC_Order_B003.MOFC_Order_B003_S001',
                      },
                    ],
                  },
                  {
                    title: '工单下发大节点',
                    dataIndex: 'MOFC.currentCode.MOFC_Order_B005',
                    children: [
                      {
                        title: '工单下发默认小节点',
                        dataIndex: 'MOFC.currentCode.MOFC_Order_B005.MOFC_Order_B005_S001',
                      },
                    ],
                  },
                  {
                    title: '计划创建大节点',
                    dataIndex: 'MOFC.currentCode.MOFC_Order_B002',
                    children: [
                      {
                        title: '计划创建默认小节点',
                        dataIndex: 'MOFC.currentCode.MOFC_Order_B002.MOFC_Order_B002_S001',
                      },
                    ],
                  },
                  {
                    title: '订单归集确认大节点',
                    dataIndex: 'MOFC.currentCode.MOFC_Order_B004',
                    children: [
                      {
                        title: '订单归集确认默认小节点',
                        dataIndex: 'MOFC.currentCode.MOFC_Order_B004.MOFC_Order_B004_S001',
                      },
                    ],
                  },
                  {
                    title: '计划接入大节点',
                    dataIndex: 'MOFC.currentCode.MOFC_Order_B001',
                    children: [
                      {
                        title: '计划接入默认小节点',
                        dataIndex: 'MOFC.currentCode.MOFC_Order_B001.MOFC_Order_B001_S001',
                      },
                    ],
                  },
                ],
              },
              {
                title: 'LRP',
                dataIndex: 'LRP',
                children: [
                  {
                    title: '调度',
                    dataIndex: 'LRP.currentCode.LRP_Dispatch_B002',
                    children: [
                      {
                        title: '配车',
                        dataIndex: 'LRP.currentCode.LRP_Dispatch_B002.LRP_Dispatch_B002_S003',
                      },
                      {
                        title: '生成提货单',
                        dataIndex: 'LRP.currentCode.LRP_Dispatch_B002.LRP_Dispatch_B002_S004',
                      },
                      {
                        title: '生成入库单',
                        dataIndex: 'LRP.currentCode.LRP_Dispatch_B002.LRP_Dispatch_B002_S007',
                      },
                      {
                        title: '订单归集',
                        dataIndex: 'LRP.currentCode.LRP_Dispatch_B002.LRP_Dispatch_B002_S001',
                      },
                    ],
                  },
                  {
                    title: '到达',
                    dataIndex: 'LRP.currentCode.LRP_Sign_B005',
                    children: [
                      {
                        title: '签收信息上传',
                        dataIndex: 'LRP.currentCode.LRP_Sign_B005.LRP_Sign_B005_S004',
                      },
                      {
                        title: '回传前端上账55',
                        dataIndex: 'LRP.currentCode.LRP_Sign_B005.LRP_Sign_B005_S005',
                      },
                      {
                        title: '回传前端上账',
                        dataIndex: 'LRP.currentCode.LRP_Sign_B005.LRP_Sign_B005_S003',
                      },
                    ],
                  },
                  {
                    title: '回单',
                    dataIndex: 'LRP.currentCode.LRP_End_B006',
                    children: [
                      {
                        title: '回单',
                        dataIndex: 'LRP.currentCode.LRP_End_B006.LRP_End_B006_S001',
                      },
                    ],
                  },
                  {
                    title: '订单处理',
                    dataIndex: 'LRP.currentCode.LRP_New_B001',
                    children: [
                      {
                        title: '订单接入',
                        dataIndex: 'LRP.currentCode.LRP_New_B001.LRP_New_B001_S001',
                      },
                    ],
                  },
                  {
                    title: '发货',
                    dataIndex: 'LRP.currentCode.LRP_Transport_B003',
                    children: [
                      {
                        title: '过账信息上传',
                        dataIndex: 'LRP.currentCode.LRP_Transport_B003.LRP_Transport_B003_S007',
                      },
                      {
                        title: '司机认证',
                        dataIndex: 'LRP.currentCode.LRP_Transport_B003.LRP_Transport_B003_S001',
                      },
                      {
                        title: '送货单生成',
                        dataIndex: 'LRP.currentCode.LRP_Transport_B003.LRP_Transport_B003_S006',
                      },
                      {
                        title: 'WMS下账数量回传',
                        dataIndex: 'LRP.currentCode.LRP_Transport_B003.LRP_Transport_B003_S005',
                      },
                    ],
                  },
                ],
              },
            ],
            searchCount: true,
            pages: 22,
          },
        }; // await getAllFullLinkRecordVo(params, sort);
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
