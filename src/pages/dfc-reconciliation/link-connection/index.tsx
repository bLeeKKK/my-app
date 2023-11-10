import React, { useEffect } from 'react';
// import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findByPage } from './service';
import Edit from './components/Edit';
import { useDispatch, useSelector, useHistory } from 'umi';
import {
  EditOutlined,
  // DeleteOutlined,
  GroupOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons';
import IconBox from '@/components/IconBox';
// import MyAccess from '@/components/MyAccess';

// const handleDelete = async (id: string) => {
//   const { success, message: msg } = await businessFlowConfigDelete({ id });
//   if (success) message.success(msg);
//   return success;
// };

const columnsEnum = {
  true: { text: '启用', status: 'success' },
  false: { text: '禁用', status: 'error' },
};

const TableList: React.FC = () => {
  const { actionRef } = useSelector((state: any) => state.linkConnection);
  const dispatch = useDispatch();
  const history = useHistory();
  const { dz_type, dz_warn_method } = useSelector((state: any) => state.dictionary);
  const dzType = dz_type?.map(({ name: label, value }: any) => ({ label, value }));
  const dzWarnMethod = dz_warn_method?.map(({ name: label, value }: any) => ({ label, value }));

  useEffect(() => {
    dispatch({ type: 'dictionary/findAllByDictCode', payload: { code: 'dz_type' } });
    dispatch({ type: 'dictionary/findAllByDictCode', payload: { code: 'dz_warn_method' } });
  }, [dispatch]);

  const columns: ProColumns<any>[] = [
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
              type: 'linkConnection/setEdit',
              payload: {
                edit: record,
                visible: true,
                editType: 2,
              },
            });
          }}
          timeOutClose={undefined}
          icon={EditOutlined}
          text="编辑"
        />,
        record?.status ? (
          <IconBox
            key="edit"
            onClick={() =>
              dispatch({
                type: 'linkConnection/updateStatus',
                payload: {
                  flowId: record?.id,
                  status: !record?.status,
                },
                callback: () => {
                  actionRef.current?.reload();
                },
              })
            }
            timeOutClose={undefined}
            icon={CloseSquareOutlined}
            text="禁用"
          />
        ) : (
          <IconBox
            key="edit"
            onClick={() =>
              dispatch({
                type: 'linkConnection/updateStatus',
                payload: {
                  flowId: record?.id,
                  status: !record?.status,
                },
                callback: () => {
                  actionRef.current?.reload();
                },
              })
            }
            timeOutClose={undefined}
            icon={CheckSquareOutlined}
            text="启用"
          />
        ),
        <IconBox
          key="config"
          timeOutClose={1000}
          onClick={() => {
            history.push(
              '/dfc-reconciliation/link-connection/link-canvas' + '?id=' + (record?.id || ''),
            );
          }}
          icon={GroupOutlined}
          text="配置流程"
        />,
      ],
    },
    { title: '对账流程名称', dataIndex: 'name', width: 200 },
    { title: '是否成功', dataIndex: 'status', valueEnum: columnsEnum, fixed: true, width: 100 },
    {
      title: '对账类型',
      dataIndex: 'dzType',
      valueType: 'select',
      fieldProps: { options: dzType },
    },
    {
      title: '预警方式',
      dataIndex: 'warnMethod',
      valueType: 'select',
      fieldProps: { options: dzWarnMethod },
    },
    { title: '备注', dataIndex: 'remark', width: 150 },
    { title: '执行时间', dataIndex: 'executeTime' },
    { title: '创建时间', dataIndex: 'createdDate' },
    { title: '创建人名称', dataIndex: 'creatorName' },
    { title: '最后编辑时间', dataIndex: 'lastEditedDate' },
    { title: '最后编辑人名称', dataIndex: 'lastEditorName' },
  ];

  return (
    // <PageContainer>
    <ProTable<any, any>
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
