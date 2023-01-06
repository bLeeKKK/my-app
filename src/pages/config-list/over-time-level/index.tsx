import React from 'react';
import { message, Popconfirm, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { overTimeLevelConfigDelete, findByPage } from './service';
import type { TableListItem, TableListPagination } from './data';
import Edit, { FREEZE_OPTIONS, NORMAL_OPTIONS } from './components/Edit';
import { useDispatch, useSelector } from 'umi';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import IconBox from '@/components/IconBox';

const handleDelete = async (id: string) => {
  const { success, message: msg } = await overTimeLevelConfigDelete({ id });
  if (success) message.success(msg);
  return success;
};

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.overTimeLevel);
  const dispatch = useDispatch();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: true,
      width: 120,
      render: (_, record) => [
        // <IconBox key="edit" icon={EditOutlined} text="编辑" />,
        <IconBox
          key="edit"
          onClick={() => {
            dispatch({
              type: 'overTimeLevel/setEdit',
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
        <Popconfirm
          key="delete"
          title="你确定删除？"
          onConfirm={async () => {
            const flag = await handleDelete(record.id);
            if (flag && actionRef?.current) actionRef.current.reload();
          }}
          okText="确定"
          cancelText="取消"
        >
          {/* <a href="#">删除</a> */}
          <IconBox icon={DeleteOutlined} text="删除" />
        </Popconfirm>,
      ],
    },
    {
      title: '冻结状态',
      dataIndex: 'freeze',
      valueType: 'select',
      fieldProps: { options: FREEZE_OPTIONS },
      width: 100,
    },
    {
      title: '是否正常',
      dataIndex: 'normal',
      valueType: 'select',
      fieldProps: { options: NORMAL_OPTIONS },
      width: 100,
    },
    { title: '起始范围', dataIndex: 'startScope', search: false },
    { title: '结束范围', dataIndex: 'endScope', search: false },
    {
      title: '颜色',
      dataIndex: 'signColor',
      search: false,
      render: (val) => (val ? <Tag color={val}>{val}</Tag> : null),
    },
    { title: '超时等级描述', dataIndex: 'overTimeRemark' },
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
