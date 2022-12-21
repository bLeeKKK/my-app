import React from 'react';
import { message, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteUser, findByPage } from './service';
import type { TableListItem, TableListPagination } from './data';
import Edit, { STATUS_OPTIONS } from './components/Edit';
import { useDispatch, useSelector, useHistory } from 'umi';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import IconBox from '@/components/IconBox';

const handleDelete = async (id: string) => {
  const { success, message: msg } = await deleteUser(id);
  if (success) message.success(msg);
  return success;
};

// const history = useHistory();
// const item = {id:1,name:"zora"}
// // 路由跳转
// history.push(`/user/role/detail`, { id: item });
// // 参数获取
// const {state} = useLocation()
// console.log(state)  // {id:1,name:"zora"}

const AccountManagement: React.FC = () => {
  const { actionRef } = useSelector((state) => state.accountManagement);
  const dispatch = useDispatch();
  const history = useHistory();

  console.log(STATUS_OPTIONS);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: true,
      width: 120,
      render: (_, record) => [
        // <a
        //   key="edit"
        //   href="#"
        //   onClick={() => {
        //     dispatch({
        //       type: 'accountManagement/setEdit',
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
              type: 'accountManagement/setEdit',
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
            const flag = await handleDelete(record.userId);
            if (flag && actionRef?.current) actionRef.current.reload();
          }}
          okText="确定"
          cancelText="取消"
        >
          <IconBox icon={DeleteOutlined} text="删除" />
        </Popconfirm>,
      ],
    },
    { title: '用户昵称', dataIndex: 'nickName', search: false, width: 140 },
    { title: '用户名称', dataIndex: 'userName', search: false, width: 140 },
    { title: '手机号码', dataIndex: 'phonenumber', search: false, width: 150 },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { options: STATUS_OPTIONS },
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
        // scroll={{ x: 1500 }}
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

export default AccountManagement;
