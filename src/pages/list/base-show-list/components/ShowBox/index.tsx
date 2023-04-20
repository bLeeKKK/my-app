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
        {sourceSysList?.map((res1) => (
          <li key={res1.sourceSys}>
            <div className={styles['big-node']}>{res1.sourceSys}</div>
            <div className={styles['det-time']}>{timeDiff(res1.startDate, res1.endDate || now)}</div>
            <div className={styles['small-nodes']}>
              {res1?.fullLinkRecordNodeVoList?.length ? (
                res1?.fullLinkRecordNodeVoList?.map((res) => {
                  let checkHideKey = false
                  if(res1.sourceSys === 'MOFC' && data.ifFutures === false){
                   checkHideKey = true
                  }
                  return (
                    <div className={styles['small-nodes-title']} key={res.nodeName}>
                      <div>{res.nodeName}</div>
                      {res?.fullLinkRecordVoList?.map((res) => (
                        <ShowBoxItem checkHideKey={checkHideKey} data={data} res={res} now={now} key={res.smallNodeCode} />
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
