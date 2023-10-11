import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { List, Space, Empty } from 'antd';
import style from './style.less';
import { ProCard } from '@ant-design/pro-components';
import AddModalForm from './components/Edit';

const data = Array.from({ length: 23 }).map((_, i) => ({
  id: i,
  href: 'https://ant.design',
  title: `ant design part ${i}`,
  avatar: 'https://joeschmoe.io/api/v1/random',
  description:
    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
}));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space className={style['item-btn']} onClick={(e) => e.stopPropagation()}>
    {React.createElement(icon)}
    {text}
  </Space>
);
export default function Link() {
  const [select, setSelect] = useState<number>();

  return (
    <ProCard direction="column" bodyStyle={{ padding: 0 }} ghost gutter={[0, 16]}>
      <ProCard gutter={16} ghost bodyStyle={{ padding: 0 }}>
        <ProCard
          colSpan="300px"
          bodyStyle={{ padding: 0 }}
          style={{ height: 800, overflowY: 'scroll' }}
          className={style['link-list']}
        >
          <List
            header={
              <div className={style.header}>
                <span>链接列表</span>
                <AddModalForm />
              </div>
            }
            itemLayout="vertical"
            size="small"
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                onClick={() => setSelect((id) => (id === item.id ? undefined : item.id))}
                className={`${style.item} ${select === item.id ? style['item-selected'] : ''}`}
                key={item.title}
                actions={[
                  <IconText icon={EditOutlined} text="编辑" key="list-vertical-edit-o" />,
                  <IconText icon={DeleteOutlined} text="删除" key="list-vertical-delete-o" />,
                  select === item.id ? (
                    <IconText icon={ReloadOutlined} text="刷新" key="list-vertical-reload-o" />
                  ) : null,
                ]}
              >
                <List.Item.Meta
                  // avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </ProCard>
        <ProCard style={{ height: 800 }}>
          <div className={style.empty}>
            <Empty />
          </div>
        </ProCard>
      </ProCard>
    </ProCard>
  );
}
