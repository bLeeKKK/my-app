import React, { useEffect, useRef } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findByPage, interfaceCallRecordExport } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import moment from 'moment';
import { Button, Modal, message } from 'antd';
import { download } from '@/utils';
import ShowBox from './components/ShowBox';

const columns: ProColumns<TableListItem>[] = [{ title: '数据源代码', dataIndex: 'sourceCode' }];

let searchData = {};

const expandedRowRender = (data) => <ShowBox data={data} />;

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.baseShowListNo);
  const ref = useRef();

  useEffect(() => {
    if (ref) {
      // console.log(ref.current);
      // ref.current?.initialValues = {
      //   eventStDatetimes: [1, 2],
      // };
    }
  }, [ref]);

  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      headerTitle="查询表格"
      actionRef={actionRef}
      rowKey="sourceCode"
      search={{ labelWidth: 120 }}
      expandable={{
        expandedRowRender,
      }}
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
    // </PageContainer>
  );
};

export default TableList;
