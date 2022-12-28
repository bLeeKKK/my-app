import React, { useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findByPage, interfaceCallRecordExport } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import moment from 'moment';
import { Button, Modal, message } from 'antd';
import { download } from '@/utils';

function getHaveTDate(arr: any[]) {
  return [
    moment(arr[0]).format('YYYY-MM-DDTHH:mm:ss'),
    moment(arr[1]).format('YYYY-MM-DDTHH:mm:ss'),
  ];
}

// 当月开始日期时间
const startMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
// 当月结束日期时间
const endMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');

const columnsEnum = {
  0: { text: '是', status: 'success' },
  1: { text: '否', status: 'warning' },
  2: { text: '报错', status: 'error' },
};

const columns: ProColumns<TableListItem>[] = [
  { title: '是否成功', dataIndex: 'status', valueEnum: columnsEnum, fixed: true, width: 100 },
  { title: '备注', dataIndex: 'remark', fixed: true, width: 100 },
  { title: '接口标识', dataIndex: 'intfTag', ellipsis: true, width: 200 },
  { title: '接口描述', dataIndex: 'intfDescription', ellipsis: true, width: 200 },

  {
    title: '事件开始时间',
    dataIndex: 'eventStDatetime',
    width: 200,
    search: false,
    sorter: true,
    // valueType: 'dateTime',
    tip: `默认搜索使用：${startMonth} 到 ${endMonth}`,
    render: (t) => moment(t as string).format('YYYY-MM-DD HH:mm:ss.SSS'),
  },
  {
    title: '事件开始时间',
    key: 'eventStDatetimes',
    dataIndex: 'eventStDatetimes',
    valueType: 'dateTimeRange',
    hideInTable: true,
    tip: `默认搜索使用：${startMonth} 到 ${endMonth}`,
    search: {
      transform: (value: any) => ({
        eventStDatetimes: getHaveTDate(value),
      }),
    },
  },
  {
    title: '事件结束时间',
    dataIndex: 'eventEndDatetime',
    width: 200,
    search: false,
    sorter: true,
    // valueType: 'dateTime',
    render: (t) => moment(t as string).format('YYYY-MM-DD HH:mm:ss.SSS'),
  },
  {
    title: '事件结束时间',
    key: 'eventEndDatetimes',
    dataIndex: 'eventEndDatetimes',
    valueType: 'dateTimeRange',
    hideInTable: true,
    search: {
      transform: (value: any) => ({
        eventEndDatetimes: getHaveTDate(value),
      }),
    },
  },
  {
    title: '事件时间间隔(ms)',
    dataIndex: 'eventFinishInterval',
    search: false,
    valueType: 'digit',
    width: 160,
    sorter: true,
  },

  {
    title: '接口开始时间',
    dataIndex: 'intfStDatetime',
    width: 200,
    search: false,
    sorter: true,
    valueType: 'dateTime',
  },
  {
    title: '接口开始时间',
    key: 'intfStDatetimes',
    dataIndex: 'intfStDatetimes',
    valueType: 'dateTimeRange',
    hideInTable: true,
    search: {
      transform: (value: any) => ({
        intfStDatetimes: getHaveTDate(value),
      }),
    },
  },
  {
    title: '接口结束时间',
    dataIndex: 'intfEndDatetime',
    width: 200,
    search: false,
    sorter: true,
    valueType: 'dateTime',
  },
  {
    title: '接口结束时间',
    key: 'intfEndDatetimes',
    dataIndex: 'intfEndDatetimes',
    valueType: 'dateTimeRange',
    hideInTable: true,
    search: {
      transform: (value: any) => ({
        intfEndDatetimes: getHaveTDate(value),
      }),
    },
  },
  {
    title: '接口时间间隔(ms)',
    dataIndex: 'receiveDataInterval',
    search: false,
    valueType: 'digit',
    sorter: true,
  },
  {
    title: '错误描述',
    dataIndex: 'errorRemark',
    search: false,
    width: 200,
    ellipsis: {
      showTitle: true,
    },
  },
];

let searchData = {};

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.baseList);
  const ref = useRef();

  useEffect(() => {
    if (ref) {
      console.log(ref.current);
      // ref.current?.initialValues = {
      //   eventStDatetimes: [1, 2],
      // };
    }
  }, [ref]);

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        form={{
          initialValues: {
            eventStDatetimes: [startMonth, endMonth],
          },
        }}
        rowKey="key"
        search={{ labelWidth: 120 }}
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
        scroll={{ x: 2000 }}
        formRef={ref}
        request={async (params, sort) => {
          searchData = params;
          const { success, data } = await findByPage(params, sort);
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
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
