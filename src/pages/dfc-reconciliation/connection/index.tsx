import { useState, useRef, useEffect } from 'react';
import style from './style.less';
import { ProCard } from '@ant-design/pro-components';
import ListBox from './components/List';
import AddModalForm from './components/Edit';
import styles from './style.less';

const Connection = () => {
  const [select, setSelect] = useState<any>();
  const listRef = useRef<any>();
  const [shadow, setShadow] = useState(false);
  const timer = useRef<any>();

  useEffect(() => {
    if (select) return;
    if (timer.current) clearTimeout(timer.current);
    setShadow(true);
    timer.current = setTimeout(function () {
      setShadow(false);
    }, 1000);
  }, [select]);

  return (
    <ProCard direction="column" bodyStyle={{ padding: 0 }} ghost gutter={[0, 16]}>
      <ProCard gutter={16} ghost bodyStyle={{ padding: 0 }}>
        <ProCard
          colSpan="300px"
          bodyStyle={{ padding: 0 }}
          style={{ height: 800, overflowY: 'scroll' }}
          className={style['connection-list']}
        >
          <ListBox setSelect={setSelect} select={select} ref={listRef} />
        </ProCard>
        <ProCard
          style={{ height: 800, overflowY: 'scroll' }}
          className={`${shadow ? styles.pulse : ''}`}
        >
          <AddModalForm select={select} setSelect={setSelect} listRef={listRef} />
        </ProCard>
      </ProCard>
    </ProCard>
  );
};

export default Connection;
