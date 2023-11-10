import React from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findByPage } from './service';
import { useDispatch, useSelector } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import IconBox from '@/components/IconBox';
// import MyAccess from '@/components/MyAccess';

// const handleDelete = async (id: string) => {
//   const { success, message: msg } = await businessFlowConfigDelete({ id });
//   if (success) message.success(msg);
//   return success;
// };

const columnsEnum = {
  true: { text: '成功', status: 'success' },
  false: { text: '失败', status: 'error' },
};

const expandedRowRender = (record: any) => {
  const data = record?.dfcdzResultDetailList || [];
  return (
    <ProTable
      style={{ marginTop: '8px' }}
      columns={[
        { title: '对账模型名称', dataIndex: 'modelName' },
        { title: '主实体名称', dataIndex: 'primaryEntityName' },
        { title: '主实体对账总数量', dataIndex: 'mainCount' },
        { title: '主实体单边数量', dataIndex: 'mainUnilateralCount' },
        { title: '副实体名称', dataIndex: 'subEntityName' },
        { title: '副实体对账总数量', dataIndex: 'subCount' },
        { title: '副实体单边数量', dataIndex: 'subUnilateralCount' },
        { title: '错账数量', dataIndex: 'wrongCount' },
        { title: '对账模型名称', dataIndex: 'modelName' },
        { title: '执行耗时(秒)', dataIndex: 'executeTime' },
        { title: '对平数量', dataIndex: 'alignmentCount' },
      ]}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={data}
      pagination={false}
    />
  );
};

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state: any) => state.linkConnection);
  const dispatch = useDispatch();

  const columns: ProColumns<any>[] = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: true,
      width: 80,
      render: (_, record) => [
        <IconBox
          key="edit"
          onClick={() => {
            dispatch({
              type: 'dfcShowList/exportResult',
              payload: {
                batchNo: record.batchNo,
                flowName: record.flowName,
                executeBeginTime: record.executeBeginTime,
              },
            });
          }}
          timeOutClose={undefined}
          icon={DownloadOutlined}
          text="下载对账结果"
        />,
      ],
    },
    { title: '关联对账流程名称', dataIndex: 'flowName' },
    {
      title: '是否成功',
      dataIndex: 'successFlag',
      valueEnum: columnsEnum,
      width: 100,
    },
    { title: '执行时间', dataIndex: 'executeBeginTime' },
    { title: '执行人', dataIndex: 'executeAccount' },
  ];

  return (
    // <PageContainer>
    <ProTable<any, any>
      headerTitle="查询表格"
      actionRef={actionRef}
      search={{ labelWidth: 120 }}
      sticky
      expandable={{ expandedRowRender }}
      scroll={{ x: 1000 }}
      rowKey="batchNo"
      // pagination={{
      //   pageSize: 30,
      // }}
      request={async (params) => {
        const { success, data }: any = await findByPage(params);
        return {
          success: success,
          data: data.records,
          total: data.total,
        };
      }}
      columns={columns}
    />
    // </PageContainer>
  );
};

export default TableList;
