import { useState } from 'react';
import { Empty } from 'antd';
import style from './style.less';
import { ProCard } from '@ant-design/pro-components';
import type { ShowDataType } from './data.d';
import ListBox from './components/List';
import ShowContent from './components/ShowContent';

export default function Link() {
  const [select, setSelect] = useState<ShowDataType | undefined>();
  console.log(select);

  return (
    <ProCard direction="column" bodyStyle={{ padding: 0 }} ghost gutter={[0, 16]}>
      <ProCard gutter={16} ghost bodyStyle={{ padding: 0 }}>
        <ProCard
          colSpan="300px"
          bodyStyle={{ padding: 0 }}
          style={{ height: 800, overflowY: 'scroll' }}
          className={style['link-list']}
        >
          <ListBox select={select} setSelect={setSelect} />
        </ProCard>
        <ProCard style={{ height: 800, overflowY: 'scroll' }}>
          {select ? (
            <ShowContent data={select} />
          ) : (
            <div className={style.empty}>
              <Empty />
            </div>
          )}
        </ProCard>
      </ProCard>
    </ProCard>
  );
}
