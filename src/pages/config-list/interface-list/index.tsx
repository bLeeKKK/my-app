import React from 'react';
import { message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteConfig, findByPage } from './service';
import type { TableListItem, TableListPagination } from './data';
import Edit, { BASETYPE_OPTIONS } from './components/Edit';
import { useDispatch, useSelector } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import IconBox from '@/components/IconBox';

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
      width: 80,
      render: (_, record) => [
        // <a
        //   key="edit"
        //   href="#"
        //   onClick={() => {
        //     dispatch({
        //       type: 'configList/setEdit',
        //       payload: {
        //         edit: record,
        //         visible: true,
        //         editType: 2,
        //       },
        //     });
        //   }}
        // >
        //   编辑
        // </a>,
        <IconBox
          key="edit"
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
          icon={EditOutlined}
          text="编辑"
        />,
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
    { title: '顺序', dataIndex: 'sort', search: false, width: 60 },
    { title: '接口标识', dataIndex: 'intfTag', width: 180, search: false },
    { title: '接口描述', dataIndex: 'intfDescription', width: 180 },
    {
      title: '基数确认类型',
      dataIndex: 'baseType',
      search: false,
      valueType: 'radio',
      fieldProps: { options: BASETYPE_OPTIONS },
      width: 80,
    },
    //根据技术类型确认展示字段
    {
      title: '事件结束平均基数值（秒）',
      dataIndex: 'eventFinishAverageBaseValue',
      width: 130,
      search: false,
      render: (t, item) => (item.baseType ? item.lastMonthEventFinishAverageBaseValue : t),
    },
    {
      title: '纯接口时效平均基数值（毫秒）',
      dataIndex: 'intfAgingAverageBaseValue',
      width: 150,
      search: false,
      render: (t, item) => (item.baseType ? item.lastMonthIntfAgingAverageBaseValue : t),
    },
    {
      title: '整体成功率平均基数值',
      dataIndex: 'overallSuccessAverageBaseValue',
      width: 130,
      search: false,
      render: (t, item) => (item.baseType ? item.lastMonthOverallSuccessAverageBaseValue : t),
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
        // pagination={{
        //   pageSize: 30,
        // }}
        request={async (params) => {
          const { current, pageSize, ...reset } = params;
          console.log('params', params);
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
    </PageContainer>
  );
};

export default TableList;
