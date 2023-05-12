import React from 'react';
import { Comment, List, Tooltip } from 'antd';
import styles from './styles.less';

export default function TableShowMessage({ dataSource }) {
  return (
    <List
      style={{ textAlign: 'left' }}
      className="comment-list"
      // header={`${dataSource.length}条 消息答复`}
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={(item) => (
        <>
          <li>
            <Comment
              author={item.creatorAcount}
              content={item.message}
              datetime={item.createdDate}
            />
          </li>
        </>
      )}
    />
  );
}
