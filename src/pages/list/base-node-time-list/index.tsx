import React, { useRef, useState, Fragment } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
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
      width: '110px',
    };
  });

  return newArr;
}

// const expandedRowRender = (data) => <ShowBox data={data} />;

// const now = new Date();
const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.baseNodeTimeList);
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
    const names = smallNode?.smallNodeName || [];
    const times = smallNode?.smallNodeTime || [];
    return (
      <>
        {names.map((res, index) => {
          return (
            <Fragment key={index}>
              {res}：{times[index]}
              <br />
            </Fragment>
          );
        })}
        {smallNode?.aging}
        {/* <Popover
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
        </Popover> */}
      </>
    );
  });

  return (
    <PageContainer>
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
        bordered
        sticky
        scroll={{ x: '100px' }}
        formRef={ref}
        request={async (params, sort) => {
          searchData = params;
          const { success, data } = await Promise.resolve({
            success: true,
            data: {
              records: [
                {
                  serviceType: null,
                  no: '113011',
                  transType: null,
                  B8F385C4E8DD404FB955564A0B48EF1A: {
                    '933565A0E2D84F4B987B9D48B2C23A02': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    FDB8A6174EE24DF28A06A332CB3AF290: {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                  },
                  '5833520DE86E4C93A969A1E0C035000E': {
                    '337CC46F72BA4D7F9D671D09811255E4': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '2CB097DC3D9D49348627EE67CD084FCD': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '28F28765B1504FC38046F61E2B22E3AF': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '62DDD6D6C3FB44B9B934F177D862C122': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '069EB075765349F6923524C192A98E94': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '39BAB84FFEBF411789EC1766F3C6F369': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    D0F7DF97761C49899487D315FA2AE1DA: {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '592326EE61BB45C08787319422ED7082': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '1E7765AB555946A0915E559587D85967': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '7D418FDA8CAC49AEA6DAB4F1DFC3D824': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    '81938E76D2874C8881433422BA3FDEF0': {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    E6B0BFA5CE63443EBFE1C832F7D5B804: {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                    CC7C6AB9312C4A0199B7A0DD0E443E26: {
                      smallNodeTime: ['60分钟', '60分钟'],
                      aging: '正常 120分钟',
                      smallNodeName: ['初始', '审核'],
                    },
                  },
                  ASD32WC4E8DD409FB923564A0B48EF1: {},
                  '157A6975A4414D5585BB617EB2F095E1': {},
                },
              ],
              total: 185953,
              size: 10,
              current: 1,
              orders: [],
              headerData: [
                { title: 'uso单号', dataIndex: 'no' },
                { title: 'scmc单号', dataIndex: 'scmcOrderNo' },
                { title: 'mofc单号', dataIndex: 'mofcOrderNo' },
                { title: 'lrp单号', dataIndex: 'lrpOrderNo' },
                { title: '运输产品', dataIndex: 'transType' },
                { title: '服务要求', dataIndex: 'serviceType' },
                {
                  title: '业务',
                  dataIndex: 'B8F385C4E8DD404FB955564A0B48EF1A',
                  children: [
                    {
                      title: '财务审核时效',
                      dataIndex:
                        'B8F385C4E8DD404FB955564A0B48EF1A.FDB8A6174EE24DF28A06A332CB3AF290',
                    },
                    {
                      title: 'C端货源占用时效',
                      dataIndex:
                        'B8F385C4E8DD404FB955564A0B48EF1A.933565A0E2D84F4B987B9D48B2C23A02',
                    },
                  ],
                },
                {
                  title: '物流',
                  dataIndex: '5833520DE86E4C93A969A1E0C035000E',
                  children: [
                    {
                      title: 'C端派单时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.069EB075765349F6923524C192A98E94',
                    },
                    {
                      title: '确定物流方式时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.337CC46F72BA4D7F9D671D09811255E4',
                    },
                    {
                      title: '归集时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.28F28765B1504FC38046F61E2B22E3AF',
                    },
                    {
                      title: '配送时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.2CB097DC3D9D49348627EE67CD084FCD',
                    },
                    {
                      title: '民生派单时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.7D418FDA8CAC49AEA6DAB4F1DFC3D824',
                    },
                    {
                      title: 'C端出库时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.D0F7DF97761C49899487D315FA2AE1DA',
                    },
                    {
                      title: '到车时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.592326EE61BB45C08787319422ED7082',
                    },
                    {
                      title: '装车时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.39BAB84FFEBF411789EC1766F3C6F369',
                    },
                    {
                      title: '在途时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.81938E76D2874C8881433422BA3FDEF0',
                    },
                    {
                      title: '回单时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.E6B0BFA5CE63443EBFE1C832F7D5B804',
                    },
                    {
                      title: '业务总时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.CC7C6AB9312C4A0199B7A0DD0E443E26',
                    },
                    {
                      title: '履约时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.1E7765AB555946A0915E559587D85967',
                    },
                    {
                      title: '物流总时效',
                      dataIndex:
                        '5833520DE86E4C93A969A1E0C035000E.62DDD6D6C3FB44B9B934F177D862C122',
                    },
                  ],
                },
                { title: '财务', dataIndex: 'ASD32WC4E8DD409FB923564A0B48EF1' },
                { title: '财务', dataIndex: '157A6975A4414D5585BB617EB2F095E1' },
              ],
              searchCount: true,
              pages: 18596,
            },
          });

          // await getAllFullLinkRecordVo(params, sort);
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
    </PageContainer>
  );
};

export default TableList;
