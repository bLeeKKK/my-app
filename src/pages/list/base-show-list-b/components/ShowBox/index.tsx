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
  sourceSysList&&sourceSysList.forEach(e=>{
  
let lastIndex = undefined
let tempKey = 0

e.fullLinkRecordNodeVoList.forEach((item,index)=>{
  if(item.fullLinkRecordVoList.length > 0){
    if(tempKey === 0) {
      tempKey ++
      lastIndex  = index
    }
    else if(tempKey === 1){
      if((index - lastIndex -1) === 0){
        lastIndex = index
        tempKey = 1
      }else{
        for (let i = lastIndex + 1; i < index; i++) {
          e.fullLinkRecordNodeVoList[i].show = false
           tempKey = 1
           lastIndex = index
        }
      }
    }
  }
})
})

  return (
    <div className={styles.warper}>
      <ul className={styles['ul-box']}>
        {sourceSysList?.map((res1) => (
          <li key={res1.sourceSys}>
            <div className={styles['big-node']}>{res1.sourceSys}</div>
            <div className={styles['det-time']}>{timeDiff(res1.startDate, res1.endDate || now)}</div>
            <div className={styles['small-nodes']}>
              {res1?.fullLinkRecordNodeVoList?.length ? (
                res1?.fullLinkRecordNodeVoList?.map((res,i) => {
                  
                  let checkHideKey = false
                  if(res1.sourceSys === 'MOFC' && data.ifFutures === false){
                   checkHideKey = true
                  }
                  
                  if(res.show != false){
                    return (
                      <div className={styles['small-nodes-title']} key={res.nodeName}>
                        <div>{res.nodeName}</div>
                        {res?.fullLinkRecordVoList?.map((res) => (
                          <ShowBoxItem checkHideKey={checkHideKey}  data={data} res={res} now={now} key={res.smallNodeCode} />
                        ))}
                      </div>
                    )
                  }else{
                    return ''
                  }
                  
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
