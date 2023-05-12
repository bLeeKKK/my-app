import { useState } from 'react';
import { Empty, Tag, Popover } from 'antd';
import styles from './styles.less';
import moment from 'moment';
import { useRafInterval } from 'ahooks';
import TableShowMessage from '@/components/TableShowMessage';

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
        {sourceSysList?.map((res1) => (
          <li key={res1.sourceSys} className={styles['li-box']}>
            <div className={styles['big-node']}>{res1.sourceSys}</div>
            <div className={styles['det-time']}>
              {timeDiff(res1.startDate, res1.endDate || now)}
            </div>
            <div className={styles['small-nodes']}>
              {res1?.fullLinkRecordNodeVoList?.length ? (
                res1?.fullLinkRecordNodeVoList?.map((res) => {
                  let checkHideKey = false;
                  if (res1.sourceSys === 'MOFC' && data.ifFutures === false) {
                    checkHideKey = true;
                  }
                  return (
                    <div className={styles['small-nodes-title']} key={res.nodeName}>
                      <div>{res.nodeName}</div>
                      {res?.fullLinkRecordVoList?.map((res) => {
                        if (checkHideKey && data.hiddenNodeCodes.includes(res.nodeCode)) {
                          return '';
                        } else {
                          //根据节点名字控制渲染方式
                          if (
                            res.nodeCode === 'MOFC_Order_B105' ||
                            res.nodeCode === 'MOFC_Order_B106' ||
                            res.nodeCode === 'LRP_Dispatch_B162' ||
                            res.nodeCode === 'LRP_New_B102' ||
                            res.nodeCode === 'MOFC_Order_B107' ||
                            res.nodeCode === 'LRP_Dispatch_B172'
                          ) {
                            return res.remark;
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
                          } else if (
                            res.nodeCode === 'MOFC_Order_B100' ||
                            res.nodeCode === 'MOFC_Order_B101' ||
                            res.nodeCode === 'MOFC_Order_B104' ||
                            res.nodeCode === 'LRP_Dispatch_B112' ||
                            res.nodeCode === 'LRP_Dispatch_B122'
                          ) {
                            return res.remark
                              ? moment(res.remark).format('YYYY-MM-DD HH:mm:ss')
                              : '-';
                          } else {
                            return (
                              <>
                                <div className={styles['small-node-show']} key={res.smallNodeCode}>
                                  <div className={styles['show-left']}>
                                    <div className={styles['show-left-name']}>
                                      【{res.smallNodeName}】
                                    </div>
                                    <div>待办：{res.agendaCause || '-'}</div>
                                    <div>
                                      <Tag color={res.signColor}>{res.overTimeRemark}</Tag>
                                    </div>
                                  </div>
                                  <div className={styles['show-right']}>
                                    <div>
                                      开始时间：
                                      {moment(res.startDate).format('YYYY-MM-DD HH:mm:ss')}
                                    </div>
                                    <div>
                                      结束时间：
                                      {res.endDate
                                        ? moment(res.endDate || now).format('YYYY-MM-DD HH:mm:ss')
                                        : '处理中'}
                                    </div>
                                    <div>{timeDiff(res.startDate, res.endDate || now)}</div>
                                  </div>
                                </div>
                                <TableShowMessage dataSource={res.nodeMessageList} />
                              </>
                            );
                          }
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
