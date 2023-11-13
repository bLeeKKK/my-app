import React, { useState } from 'react';
import { Table, Spin, Form, Typography, Popconfirm, Input, InputNumber } from 'antd';
import type { ShowDataType } from '../data.d';
import { ProDescriptions } from '@ant-design/pro-components';
import {
  SYS_OPTIONS,
  YESORNO_OPTIONS,
  DB_OPTIONS,
  // FREEZE_OPTIONS
} from './Edit';
import { editBusinessEntity } from '../service';

const EditableCell: React.FC<any> = ({
  editing,
  dataIndex,
  // title,
  inputType,
  record,
  // index,
  children,
  ...restProps
}) => {
  const Item: React.FC<any> = inputType === 'number' ? InputNumber : Input;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Item initialValue={record[dataIndex]} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ShowContent = ({
  data = {} as any,
  setData,
}: {
  data: ShowDataType | undefined;
  setData: any;
}) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: any) => record.id === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue(record);
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (record: any) => {
    try {
      setSaveLoading(true);
      const row: any = await form.validateFields();
      const params: any = { ...record, ...row };
      const { success, data: resData } = await editBusinessEntity(params);
      setSaveLoading(false);
      if (success) {
        setData((d: any) => {
          if (!d) return;
          const businessEntityList = d.businessEntityList || [];

          return {
            ...d,
            businessEntityList: businessEntityList.map((item: any) => {
              if (item.id === resData.id) {
                return resData;
              }
              return item;
            }),
          };
        });
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '字段名称',
      dataIndex: 'fieldName',
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDesc',
    },
    {
      title: '字段备注',
      dataIndex: 'fieldRemark',
      editable: true,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
    },
    {
      title: '编辑',
      dataIndex: 'operation',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <Spin spinning={saveLoading}>
            <Typography.Link onClick={() => save(record)} style={{ marginRight: 8 }}>
              保存
            </Typography.Link>
            <Popconfirm title="确定取消？" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </Spin>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <ProDescriptions title={data.sourceName} bordered>
        <ProDescriptions.Item label="数据源IP">{data.sourceIp}</ProDescriptions.Item>
        <ProDescriptions.Item label="数据源端口">{data.sourcePort}</ProDescriptions.Item>
        <ProDescriptions.Item label="数据库名称">{data.sourceDbName}</ProDescriptions.Item>
        <ProDescriptions.Item label="数据源用户名">{data.sourceUserName}</ProDescriptions.Item>
        <ProDescriptions.Item label="数据源密码" valueType="password" span={2}>
          {data.sourcePwd}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="数据源类型">
          {DB_OPTIONS.find((item) => item.value === data.sourceType)?.label}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="数据源系统">
          {SYS_OPTIONS.find((item) => item.value === data.sourceSystem)?.label}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="数据源系统">
          {YESORNO_OPTIONS.find((item) => item.value === data.sourceFlag)?.label}
        </ProDescriptions.Item>
        {/* <ProDescriptions.Item label="状态"> */}
        {/*   {FREEZE_OPTIONS.find((item) => item.value === data.sourceFlag)?.label} */}
        {/* </ProDescriptions.Item> */}
        <ProDescriptions.Item label="数据源视图名">{data.viewName}</ProDescriptions.Item>
      </ProDescriptions>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          style={{ marginTop: '16px' }}
          bordered
          columns={mergedColumns}
          dataSource={data.businessEntityList || []}
        />
      </Form>
    </>
  );
};

export default ShowContent;
