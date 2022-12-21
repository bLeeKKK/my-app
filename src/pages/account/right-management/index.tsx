import React from 'react';
import { message, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteById, findByPage } from './service';
import type { TableListItem, TableListPagination } from './data';
import Edit, { STATUS_OPTIONS } from './components/Edit';
import { useDispatch, useSelector, useRequest } from 'umi';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import IconBox from '@/components/IconBox';

const handleDelete = async (id: string) => {
  const { success, message: msg } = await deleteById(id);
  if (success) message.success(msg);
  return success;
};

const RightManagement: React.FC = () => {
  const { actionRef } = useSelector((state) => state.rightManagement);
  const dispatch = useDispatch();
  // const { data, loading } = useRequest(() => treeselect());

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: true,
      width: 120,
      render: (_, record) => [
        <IconBox
          key="edit"
          onClick={() => {
            dispatch({
              type: 'rightManagement/setEdit',
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
            const flag = await handleDelete(record.menuId);
            if (flag && actionRef?.current) actionRef.current.reload();
          }}
          okText="确定"
          cancelText="取消"
        >
          <IconBox icon={DeleteOutlined} text="删除" />
        </Popconfirm>,
      ],
    },
    { title: '功能项', dataIndex: 'menuName', search: false, width: 140 },
    { title: '权限标识', dataIndex: 'perms', search: false, width: 140 },
    { title: '路径', dataIndex: 'path', search: false, width: 150 },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      search: false,
      fieldProps: { options: STATUS_OPTIONS },
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 120 }}
        toolBarRender={() => [<Edit key="eidt" />]}
        sticky
        pagination={false}
        // dataSource={data || []}
        request={async () => {
          const { success, data } = await findByPage();

          return {
            success,
            data,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default RightManagement;
