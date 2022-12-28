import { Tag } from 'antd';
import styles from './styles.less';
import moment from 'moment';

// 两个时间差 时分秒
export const timeDiff = (startTime, endTime) => {
  const start = moment(startTime, 'HH:mm:ss');
  const end = moment(endTime, 'HH:mm:ss');
  const diff = end.diff(start);
  const duration = moment.duration(diff);
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours || 0}小时${minutes || 0}分钟${seconds || 0}秒`;
};

export default function ShowBox({ data }) {
  const sourceSysList = data?.sourceSysList;
  return (
    <div className={styles.warper}>
      <ul className={styles['ul-box']}>
        {sourceSysList?.map((res) => (
          <li key={res.sourceSys}>
            <div className={styles['big-node']}>{res.sourceSys}</div>
            <div className={styles['det-time']}>{timeDiff(res.startDate, res.endDate)}</div>
            <div className={styles['small-nodes']}>
              {res?.fullLinkRecordNodeVoList?.length ? (
                res?.fullLinkRecordNodeVoList?.map((res) => {
                  return (
                    <div className={styles['small-nodes-title']} key={res.nodeName}>
                      <div>{res.nodeName}</div>
                      {res?.fullLinkRecordVoList?.map((res) => (
                        <div className={styles['small-node-show']} key={res.smallNodeCode}>
                          <div className={styles['show-left']}>
                            <div>{res.smallNodeName}</div>
                            <div>待办：{res.agendaCause || '-'}</div>
                            <div>
                              <Tag color={res.signColor}>{res.overTimeRemark}</Tag>
                            </div>
                          </div>
                          <div className={styles['show-right']}>
                            <div>{moment(res.startDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                            <div>{moment(res.endDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                            <div>{timeDiff(res.startDate, res.endDate)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              ) : (
                <div className={styles['small-nodes-title']}>————————————</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
