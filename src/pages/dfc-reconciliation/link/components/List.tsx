import React from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { useRequest } from 'umi';
import style from '../style.less';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { Space, List } from 'antd';
import AddModalForm from './Edit';
import type { ShowDataType } from '../data.d';
import { list } from '../service';

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space className={style['item-btn']} onClick={(e) => e.stopPropagation()}>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ListBox = ({
  setSelect,
  select,
}: {
  select: ShowDataType | undefined;
  setSelect: Dispatch<SetStateAction<ShowDataType | undefined>>;
}) => {
  const { data, loading, run } = useRequest(() => list({}), {});

  return (
    <List<ShowDataType>
      loading={loading}
      header={
        <div className={style.header}>
          <span>链接列表</span>
          <span>
            <ReloadOutlined onClick={run} className={style.reload} />
            <AddModalForm />
          </span>
        </div>
      }
      itemLayout="vertical"
      size="small"
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          onClick={() =>
            setSelect((oldSelect: ShowDataType | undefined) => {
              return oldSelect?.id === item.id ? undefined : item;
            })
          }
          className={`${style.item} ${select?.id === item.id ? style['item-selected'] : ''}`}
          key={item.sourceName}
          actions={[
            <IconText icon={EditOutlined} text="编辑" key="list-vertical-edit-o" />,
            <IconText icon={DeleteOutlined} text="删除" key="list-vertical-delete-o" />,
            // select?.id === item.id ? (
            //   <IconText icon={ReloadOutlined} text="刷新" key="list-vertical-reload-o" />
            // ) : null,
          ]}
        >
          <List.Item.Meta
            // avatar={<Avatar src={item.avatar} />}
            // title={<a href={item.sourceIp}>{item.sourceName}</a>}
            title={item.sourceName}
            description={item.remark}
          />
        </List.Item>
      )}
    />
  );
};

export default ListBox;
