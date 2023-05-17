import React, { useEffect, useRef, useState } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findByPage, interfaceCallRecordExport } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import moment from 'moment';
import { Button, Modal, message } from 'antd';
import { download } from '@/utils';
import MyAccess from '@/components/MyAccess';

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

const columns: ProColumns<TableListItem>[] = [
  {
    title: '订单时间',
    dataIndex: 'startDate',
    width: 200,
    search: false,
    fixed: true,
    tip: `默认搜索使用：${startMonth} 到 ${endMonth}`,
    valueType: 'dateTime',
    fieldProps: {
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    },
  },
  {
    title: '开始处理时间',
    key: 'startDates',
    dataIndex: 'startDates',
    valueType: 'dateTimeRange',
    hideInTable: true,
    tip: `默认搜索使用：${startMonth} 到 ${endMonth}`,
    search: {
      transform: (value: any) => ({
        startDates: getHaveTDate(value),
      }),
    },
  },
  { title: '产品公司', dataIndex: 'headOffice' },
  { title: '分公司', dataIndex: 'filiale' },
  { title: '订单号', dataIndex: 'sourceCode' },
  // { title: '节点名称', dataIndex: 'nodeName' },
];

let searchData = {};

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.baseTimeList);
  const [columnsReq, setColumnsReq] = useState([]);
  const ref = useRef();
  const nodeColumsReq = columnsReq.splice(5, 10000).map((res) => {
    res.children = (res?.children || []).map((re) => ({
      ...re,
      dataIndex: [res.title, re.dataIndex], // `${res.title}.${re.dataIndex}`,
    }));
    return {
      ...res,
    };
  });

  useEffect(() => {
    if (ref) {
      console.log(ref.current);
      // ref.current?.initialValues = {
      //   eventStDatetimes: [1, 2],
      // };
    }
  }, [ref]);

  // console.log([...columns, ...nodeColumsReq]);
  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      headerTitle="查询表格"
      actionRef={actionRef}
      bordered
      form={{
        initialValues: { startDates: [startMonth, endMonth] },
      }}
      rowKey="key"
      search={{ labelWidth: 120 }}
      toolBarRender={() => [
        <MyAccess aKey="list:base-report-forms:export" key="export">
          <Button
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
          </Button>
        </MyAccess>,
      ]}
      scroll={{ x: 3000 }}
      sticky
      formRef={ref}
      request={async (params, sort) => {
        searchData = params;
        const { success, data } = await findByPage(params, sort);
        const arr = data?.records || [];

        const newArr = arr.map((res) => {
          const obj = (res?.detailList || []).reduce((pre, item) => {
            return {
              ...pre,
              [item.nodeName]: item,
            };
          }, {});
          return {
            ...res,
            ...obj,
          };
        });
        // console.log(newArr);
        setColumnsReq(data?.headerData || []);
        return {
          success: success,
          data: newArr,
          total: data.total,
        };
      }}
      pagination={{
        showSizeChanger: true,
      }}
      columns={[...columns, ...nodeColumsReq]}
    />
    // </PageContainer>
  );
};

export default TableList;
