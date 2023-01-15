import { useState } from 'react';
import { Empty } from 'antd';
import styles from './styles.less';

import { useRafInterval } from 'ahooks';
import ShowBoxItem from './ShowBoxItem';
import { timeDiff } from '@/utils';

export default function ShowBox({ data }) {
  const sourceSysList = data?.sourceSysList;
  const [now, setNow] = useState(new Date());

  useRafInterval(() => {
    setNow(new Date());
  }, 1000);

  return (
    <div className={styles.warper}>
      <ul className={styles['ul-box']}>
        {sourceSysList?.map((res) => (
          <li key={res.sourceSys}>
            <div className={styles['big-node']}>{res.sourceSys}</div>
            <div className={styles['det-time']}>{timeDiff(res.startDate, res.endDate || now)}</div>
            <div className={styles['small-nodes']}>
              {res?.fullLinkRecordNodeVoList?.length ? (
                res?.fullLinkRecordNodeVoList?.map((res) => {
                  return (
                    <div className={styles['small-nodes-title']} key={res.nodeName}>
                      <div>{res.nodeName}</div>
                      {res?.fullLinkRecordVoList?.map((res) => (
                        <ShowBoxItem res={res} now={now} key={res.smallNodeCode} />
                      ))}
                    </div>
                  );
                })
              ) : (
                <div className={styles['small-nodes-title']}>————————————</div>
              )}
            </div>
          </li>
        )) || <Empty />}
      </ul>
    </div>
  );
}
