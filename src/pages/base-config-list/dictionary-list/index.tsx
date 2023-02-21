import React, { useState } from 'react';
import { ProCard, ProList } from '@ant-design/pro-components';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Edit from './components/Edit';
import EditDetails from './components/EditDetails';
import { Tooltip, Popconfirm } from 'antd';
import {
  sysDictfindByPage,
  findAllByDictCode,
  sysDictDetailDelete,
  sysDictDelete,
} from './service';
import styles from './style.less';
import { useDispatch, useSelector } from 'umi';
import ProTable from '@ant-design/pro-table';
import { useControllableValue } from 'ahooks';
import { message } from 'antd';

const IconText = ({ icon, text, ...props }: any) => {
  const Icon = icon;
  return (
    <Tooltip placement="top" title={text}>
      <Icon {...props} />
    </Tooltip>
  );
};

// 删除目录
const handleDelete = async (id: string) => {
  const { success } = await sysDictDelete({ id });
  if (success) message.success('删除成功');
  return success;
};

// 删除详情
const handleDeleteDetail = async (id: string) => {
  const { success } = await sysDictDetailDelete({ id });
  if (success) message.success('删除成功');
  return success;
};

// 字典目录
const ROW_KEY = 'code';
const Catalogue: React.FC = (props) => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useControllableValue<string[]>(props, {
    defaultValue: [],
  });

  // const [selectedRowKeys, setSelectedRowKeys] = useState<string>([]);
  const { actionRef } = useSelector((state) => state.dictionaryList);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: string[]) => setSelectedRowKeys(keys),
    type: 'radio',
    alwaysShowAlert: false,
  };

  const onEdit = (row) => {
    dispatch({
      type: 'dictionaryList/setEdit',
      payload: {
        edit: row,
        visible: true,
        editType: 2,
      },
    });
  };

  return (
    <div className={styles['left-list']}>
      <ProList<{ title: string }>
        // showActions="hover"
        split={true}
        headerTitle="字典目录"
        toolBarRender={() => {
          return [<Edit key="eidt" />];
        }}
        actionRef={actionRef}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (record?.id) setSelectedRowKeys([record[ROW_KEY]]);
            },
          };
        }}
        request={async (params = {}) => {
          const { success, data } = await sysDictfindByPage(params);
          return {
            success: success,
            data: data.records,
            total: data.total,
          };
        }}
        size="small"
        bordered
        rowSelection={rowSelection}
        rowKey={ROW_KEY}
        metas={{
          title: { dataIndex: 'name' },
          description: {},
          subTitle: {
            dataIndex: 'code',
          },
          actions: {
            cardActionProps: 'extra',
            render: (_, row) => [
              <IconText
                icon={EditOutlined}
                text="编辑"
                key="list-vertical-edit"
                onClick={() => onEdit(row)}
              />,
              <Popconfirm
                key="del"
                placement="top"
                title="确定删除？"
                onConfirm={async () => {
                  const flag = await handleDelete(row.id);
                  if (flag && actionRef?.current) actionRef.current.reload();
                }}
                okText="是"
                cancelText="否"
              >
                <IconText icon={DeleteOutlined} text="删除" key="list-vertical-del" />
              </Popconfirm>,
            ],
          },
        }}
      />
    </div>
  );
};

const DictionaryList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const { actionRefDetails } = useSelector((state) => state.dictionaryList);
  const dispatch = useDispatch();
  const [dictCode] = selectedRowKeys;

  const onEdit = (row) => {
    dispatch({
      type: 'dictionaryList/setEditDetails',
      payload: {
        editDetails: row,
        visibleDetails: true,
        editTypeDetails: 2,
      },
    });
  };

  return (
    // <KeepAlive name="/base-config-list/dictionary-list">
    <ProCard split="vertical" className={styles['dir-box']}>
      <ProCard headerBordered colSpan="400px" className={styles['left-box']}>
        <Catalogue onChange={setSelectedRowKeys} />
      </ProCard>
      <ProCard ghost={true} headerBordered colSpan="calc(100% - 400px)">
        <ProTable
          actionRef={actionRefDetails}
          headerTitle="字典详情"
          rowKey="key"
          sticky
          manualRequest={true}
          search={false}
          toolBarRender={() => [<EditDetails key="editDetails" dictCode={dictCode} />]}
          params={{ dictCode }}
          request={async ({ dictCode: code }) => {
            try {
              const { success, data } = await findAllByDictCode({ dictCode: code });
              if (!success) throw new Error('获取数据失败');
              return {
                success,
                data: data,
              };
            } catch (error) {
              return { success: true, data: [] };
            }
          }}
          // dataSource={data?.data || []}
          columns={[
            {
              title: '操作',
              key: 'option',
              valueType: 'option',
              width: 120,
              render: (_, row) => [
                <IconText
                  icon={EditOutlined}
                  text="编辑"
                  key="list-vertical-edit"
                  onClick={() => onEdit(row)}
                />,
                <Popconfirm
                  key="del"
                  placement="top"
                  title="确定删除？"
                  onConfirm={async () => {
                    const flag = await handleDeleteDetail(row.id);
                    if (flag && actionRefDetails?.current) actionRefDetails.current.reload();
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <IconText icon={DeleteOutlined} text="删除" key="list-vertical-del" />
                </Popconfirm>,
              ],
            },
            { title: '名称', dataIndex: 'name' },
            { title: '实际使用值', dataIndex: 'value' },
            { title: '编码', dataIndex: 'code' },
            { title: '字典编码', dataIndex: 'dictCode' },
          ]}
        />
      </ProCard>
    </ProCard>
    // </KeepAlive>
  );
};

export default DictionaryList;
