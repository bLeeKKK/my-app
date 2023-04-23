import React from 'react';
import { message, Popconfirm } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { businessFlowConfigDelete, findByPage } from './service';
import type { TableListItem, TableListPagination } from './data';
import Edit, { FREEZE_OPTIONS } from './components/Edit';
import { useDispatch, useSelector, useHistory } from 'umi';
import { EditOutlined, DeleteOutlined, GroupOutlined } from '@ant-design/icons';
import IconBox from '@/components/IconBox';

const handleDelete = async (id: string) => {
  const { success, message: msg } = await businessFlowConfigDelete({ id });
  if (success) message.success(msg);
  return success;
};

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.operationFlow);
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
              type: 'operationFlow/setEdit',
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
        <IconBox
          onClick={() => {
            history.push('/config-list/operation-flow/flow-map' + '?id=' + (record?.id || ''));
          }}
          icon={GroupOutlined}
          text="配置流程"
          key="falow"
        />,
      ],
    },
    {
      title: '状态',
      dataIndex: 'freeze',
      valueType: 'select',
      fieldProps: { options: FREEZE_OPTIONS },
      width: 100,
    },
    { title: '流程编号', dataIndex: 'busFlowCode', width: 200 },
    { title: '流程描述', dataIndex: 'busFlowName', width: 150 },
    { title: '流程系统', dataIndex: 'sourceSys', search: false, width: 150 },
    { title: '流程类型', dataIndex: 'flowType', search: false },
  ];

  return (
    // <PageContainer>
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
        data.records.forEach(e=>{
          if(e.flowType === 0){
            e.flowType = '正向'
          }else{
            e.flowType = '逆向'
          }
        })
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
