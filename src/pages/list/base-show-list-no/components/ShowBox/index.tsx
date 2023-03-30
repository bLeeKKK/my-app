import { useState } from 'react';
import { Empty, Tag, Popover } from 'antd';
import styles from './styles.less';
import moment from 'moment';
import { useRafInterval } from 'ahooks';

// 两个时间差 时分秒
export const timeDiff = (startTime, endTime) => {
  const start = moment(startTime, 'YYYY-MM-DD HH:mm:ss');
  const end = moment(endTime, 'YYYY-MM-DD HH:mm:ss');
  const diff = end.diff(start);
  const duration = moment.duration(diff);
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours || 0}小时${minutes || 0}分钟${seconds || 0}秒`;
};

export default function ShowBox({ data }) {
  const sourceSysList = data?.sourceSysList;
  const [now, setNow] = useState(new Date());

  // useRafInterval(() => {
  //   setNow(new Date());
  // }, 1000);

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
                      {res?.fullLinkRecordVoList?.map((res) => {

                        //根据节点名字控制渲染方式
                        console.log(res);
                        if (res.nodeCode === 'MOFC_Order_B105' ||
                          res.nodeCode === 'MOFC_Order_B106' ||
                          res.nodeCode === 'LRP_Dispatch_B162' ||
                          res.nodeCode === 'LRP_Dispatch_B172') {
                          return res.remark
                        } else if (res.nodeCode === 'product_source_type') {
                          if (res.sourceType === 0) {
                            return '现货';
                          } else if (res.sourceType === 1) {
                            return '期货';
                          } else if (res.sourceType === 2) {
                            return 'C+3';
                          } else {
                            return '-';
                          }
                        } else if (res.nodeCode === 'MOFC_Order_B100' ||
                          res.nodeCode === 'MOFC_Order_B101' ||
                          res.nodeCode === 'MOFC_Order_B104' ||
                          res.nodeCode === 'LRP_Dispatch_B112' ||
                          res.nodeCode === 'LRP_Dispatch_B122') {
                          return res.remark ? moment(res.remark).format('YYYY-MM-DD HH:mm:ss') : '-';
                        }
                        else {
                          return (
                            <div className={styles['small-node-show']} key={res.smallNodeCode}>
                              <div className={styles['show-left']}>
                                <div className={styles['show-left-name']}>【{res.smallNodeName}】</div>
                                <div>待办：{res.agendaCause || '-'}</div>
                                <div>
                                  <Tag color={res.signColor}>{res.overTimeRemark}</Tag>
                                </div>
                              </div>
                              <div className={styles['show-right']}>
                                <div>
                                  开始时间：{moment(res.startDate).format('YYYY-MM-DD HH:mm:ss')}
                                </div>
                                <div>
                                  结束时间：
                                  {res.endDate
                                    ? moment(res.endDate || now).format('YYYY-MM-DD HH:mm:ss')
                                    : '处理中'}
                                </div>
                                {/* <Popover
          content={
            <>
              <div>
                开始时间：{moment(res.startDate).format('YYYY-MM-DD HH:mm:ss')}
              </div>
              <div>
                结束时间：
                {res.endDate
                  ? moment(res.endDate).format('YYYY-MM-DD HH:mm:ss')
                  : '处理中'}
              </div>
            </>
          }
        > */}
                                <div>{timeDiff(res.startDate, res.endDate || now)}</div>
                                {/* </Popover> */}
                              </div>
                            </div>
                          )
                        }

                      })}
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
