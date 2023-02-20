import React from 'react';
import { message, Popconfirm } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { nodeValidityPeriodConfigDelete, findByParent } from './service';
import type { TableListItem, TableListPagination } from './data';
import Edit, { FREEZE_OPTIONS, ROLEIDS_OPTIONS } from './components/Edit';
import { useDispatch, useSelector, useHistory } from 'umi';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import IconBox from '@/components/IconBox';

const handleDelete = async (id: string) => {
  const { success, message: msg } = await nodeValidityPeriodConfigDelete(id);
  if (success) message.success(msg);
  return success;
};

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.nodeTimerFlow);
  const dispatch = useDispatch();
  const history = useHistory();

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
              type: 'nodeTimerFlow/setEdit',
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
        <>
          {!record?.parent ? (
            <IconBox
              onClick={() => {
                dispatch({
                  type: 'nodeTimerFlow/setEdit',
                  payload: {
                    parent: record,
                    visible: true,
                    editType: 1,
                  },
                });
              }}
              icon={PlusOutlined}
              text="配置节点"
              key="falow"
            />
          ) : null}
        </>,
      ],
    },
    {
      title: '状态',
      dataIndex: 'freeze',
      valueType: 'select',
      fieldProps: { options: FREEZE_OPTIONS },
      width: 100,
    },
    { title: '时效名称', dataIndex: 'validityPeriodName', width: 200 },
    { title: '整车时效标准', dataIndex: 'warningTimeComplete', search: false },
    { title: '零担时效标准', dataIndex: 'warningTimeLess', search: false },
    {
      title: '时效标准来源',
      dataIndex: 'warningTimeSource',
      valueType: 'select',
      fieldProps: { options: ROLEIDS_OPTIONS },
    },
  ];

  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      headerTitle="查询表格"
      actionRef={actionRef}
      rowKey="id"
      search={{ labelWidth: 120 }}
      toolBarRender={() => [<Edit key="eidt" />]}
      sticky
      // scroll={{ x: 1500 }}
      // pagination={{
      //   pageSize: 30,
      // }}
      pagination={false}
      request={async (params) => {
        const { success, data } = await findByParent(0, params);
        return {
          success: success,
          data: data,
        };
      }}
      columns={columns}
    />
    // </PageContainer>
  );
};

export default TableList;
