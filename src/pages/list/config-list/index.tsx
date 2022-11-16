import React from 'react';
import { message, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteConfig, findByPage } from './service';
import type { TableListItem, TableListPagination } from './data';
import Edit, { BASETYPE_OPTIONS } from './components/Edit';
import { useSelector, useDispatch } from 'umi';

const handleDelete = async (id: string) => {
  const { success, message: msg } = await deleteConfig({ id });
  if (success) message.success(msg);
  return success;
};

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.configList);
  const dispatch = useDispatch();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: true,
      width: 120,
      render: (_, record) => [
        <a
          key="edit"
          href="#"
          onClick={() => {
            dispatch({
              type: 'configList/setEdit',
              payload: {
                edit: record,
                visible: true,
                editType: 2,
              },
            });
          }}
        >
          编辑
        </a>,
        // <Popconfirm
        //   key="delete"
        //   title="你确定删除？"
        //   onConfirm={async () => {
        //     const flag = await handleDelete(record.id);
        //     if (flag && actionRef?.current) actionRef.current.reload();
        //   }}
        //   okText="确定"
        //   cancelText="取消"
        // >
        //   <a href="#">删除</a>
        // </Popconfirm>,
      ],
    },
    { title: '接口标识', dataIndex: 'intfTag', width: 200 },
    { title: '顺序', dataIndex: 'sort', search: false },
    {
      title: '基数确认类型',
      dataIndex: 'baseType',
      search: false,
      valueType: 'radio',
      fieldProps: { options: BASETYPE_OPTIONS },
    },
    { title: '接口描述', dataIndex: 'intfDescription', width: 280, search: false },
    {
      title: '事件结束平均基数值（秒）',
      dataIndex: 'eventFinishAverageBaseValue',
      width: 200,
      search: false,
    },
    {
      title: '纯接口时效平均基数值（毫秒）',
      dataIndex: 'intfAgingAverageBaseValue',
      width: 220,
      search: false,
    },
    {
      title: '纯接口时效平均基数值（毫秒）',
      dataIndex: 'overallSuccessAverageBaseValue',
      width: 220,
      search: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{ labelWidth: 120 }}
        toolBarRender={() => [<Edit key="eidt" />]}
        sticky
        scroll={{ x: 1500 }}
        request={async (params) => {
          const { success, data } = await findByPage(params);
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

export default TableList;
