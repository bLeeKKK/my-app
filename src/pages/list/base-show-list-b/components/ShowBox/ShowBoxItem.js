import { Tag } from 'antd';
import styles from './styles.less';
import moment from 'moment';
import { timeDiff } from '@/utils';

export default function ShowBoxItem({ res, now, data, checkHideKey }) {
  if (checkHideKey && data.hiddenNodeCodes.includes(res.nodeCode)) {
    return ''
  } else if (res.smallNodeCode === 'S_NODE_61' || res.smallNodeCode === 'S_NODE_54') {
    return res.remark
  } else if (res.show === false) {

  } else {
    return (
      <>
        <div className={styles['small-node-show']} key={res.smallNodeCode}>
          <div className={styles['show-left']}>
            <div className={styles['show-left-name']}>【{res.smallNodeName}】</div>
            <div>待办：{res.agendaCause || '-'}</div>
            <div>
              <Tag color={res.signColor}>{res.overTimeRemark}</Tag>
            </div>
          </div>
          <div className={styles['show-right']}>
            <div>开始时间：{moment(res.startDate).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div>
              结束时间：
              {res.endDate ? moment(res.endDate || now).format('YYYY-MM-DD HH:mm:ss') : '处理中'}
            </div>
            <div>{timeDiff(res.startDate, res.endDate || now)}</div>
          </div>
        </div>
      </>
    );
  }

}
