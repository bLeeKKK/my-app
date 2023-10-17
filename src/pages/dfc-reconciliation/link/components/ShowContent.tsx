import { Table } from 'antd';
import type { ShowDataType } from '../data.d';
import { ProDescriptions } from '@ant-design/pro-components';
import { SYS_OPTIONS, YESORNO_OPTIONS, DB_OPTIONS, FREEZE_OPTIONS } from './Edit';

const ShowContent = ({ data = {} as any }: { data: ShowDataType | undefined }) => {
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

        <ProDescriptions.Item label="状态">
          {FREEZE_OPTIONS.find((item) => item.value === data.sourceFlag)?.label}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="数据源用户名">{data.viewName}</ProDescriptions.Item>
      </ProDescriptions>
      <Table
        style={{ marginTop: '16px' }}
        bordered
        columns={[
          {
            title: '字段描述',
            dataIndex: 'fieldDesc',
          },
          {
            title: '字段字段名',
            dataIndex: 'fieldName',
          },
          {
            title: '字段备注',
            dataIndex: 'fieldRemark',
          },
          {
            title: '字段类型',
            dataIndex: 'fieldType',
          },
        ]}
        dataSource={data.businessEntityList || []}
      />
    </>
  );
};

export default ShowContent;
