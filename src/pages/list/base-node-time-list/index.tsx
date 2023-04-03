import React, { useRef, useState, Fragment } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
// import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getAgingReport } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import { Tag, Popover, Row, Col } from 'antd';
import styles from './styles.less';
import Trend from '@/components/Trend';
import moment from 'moment';

// 不需要处理小节点的
const arrExtar = ['sourceCode'];
// 处理小节点渲染
function intoChild(arr, render) {
  const newArr = arr.map((res) => {
    // 不处理字段
    if (arrExtar.includes(res.dataIndex)) return { ...res, fixed: 'left', width: '100px' };

    res.dataIndex = Array.isArray(res?.dataIndex)
      ? res.dataIndex
      : res?.dataIndex?.split?.('.') || res.dataIndex;
    if (res.children && res.children.length) {
      res.children = intoChild(res.children, render);
      return {
        ...res,
        width: '100px',
      };
    }

    // 最小节点
    return {
      ...res,
      render,
      width: '100px',
    };
  });

  return newArr;
}

function getColor(aging = '') {
  // 正常（绿色），一般预警（蓝色），较重预警（黄色），严重预警(橙色），特别严重预警（红色）
  if (aging.includes('正常')) {
    return 'green';
  } else if (aging.includes('一般预警')) {
    return 'blue';
  } else if (aging.includes('较重预警')) {
    return 'yellow';
  } else if (aging.includes('严重预警')) {
    return 'orange';
  } else if (aging.includes('特别严重预警')) {
    return 'red';
  }
}

// const expandedRowRender = (data) => <ShowBox data={data} />;
// const now = new Date();
const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.baseNodeTimeList);
  const [nodeColumns, setNodeColumns] = useState([]);
  const ref = useRef();
  // const [now, setNow] = useState(new Date());

  // useRafInterval(() => {
  //   setNow(new Date());
  // }, 1000);

  const newColumns = intoChild(nodeColumns, (smallNode) => {
    if (smallNode === '-') {
      return smallNode;
    }
    const t = typeof smallNode;
    if (t === 'string' || t === 'number') {
      return smallNode;
    }
    const names = smallNode?.smallNodeName || [];
    const times = smallNode?.smallNodeTime || [];
    // const names = smallNode?.smallNodeName || [];
    // const times = smallNode?.smallNodeTime || [];
    return (
      <>
        <Popover
          content={
            <>
              {smallNode.smallNode?.map((res, index) => {
                return (
                  <Fragment key={index}>
                    <Row style={{ fontSize: '12px', width: '450px' }}>
                      <Col span={10}>{res.nodeName}</Col>
                      <Col span={14}>{'  【 ' + res.startDate + ' - ' + res.endDate + ' 】'}</Col>
                    </Row>
                  </Fragment>
                );
              })}
            </>
          }
        >
          <div>
            {smallNode?.agingTime ? (
              <>
                <div> {smallNode?.agingTime}分钟</div>
              </>
            ) : (
              '--'
            )}
          </div>
          <div>
            {smallNode?.aging ? (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Tag color={getColor(smallNode?.aging)}>{smallNode?.aging}</Tag>
              </div>
            ) : (
              !!names?.length && <Tag>处理中</Tag>
            )}
          </div>
        </Popover>
      </>
    );
  });
  const formatData = (data) => {

    let temp = []
    data.forEach(element => {
      if (element.title === '完成状态') {
        element.valueEnum = { true: { text: '完成' }, false: { text: '未完成' } }
        temp.push(element)
      } else if (element.title === '大节点代码') {
        let t = {}
        element.children.forEach(e => {
          t[typeof e.dataIndex === 'string' ? e.dataIndex : e.dataIndex[0]] = { text: e.title }
        })
        element.valueEnum = t
        temp.push(element)
      } else if (element.title === '预警等级') {
        let t = {}
        element.children.forEach(e => {
          t[e.dataIndex] = { text: e.title }
        })
        element.valueEnum = t
        temp.push(element)
      } else if (element.title === '开始时间') {
        element.valueType = 'dateTimeRange'
        temp.push(element)
      }
      else {

        element.hideInSearch = true
        temp.push(element)
      }
    });

    temp.forEach((e, i) => {
      if (e.title === 'uso单号') {
        temp[i].fixed = true
      }
    })
    console.log(temp);
    return temp
  }
  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      // search={{ labelWidth: 120 }}
      tableClassName={styles['base-node-time-list']}
      headerTitle="查询表格"
      actionRef={actionRef}
      rowKey="sourceCode"
      bordered
      sticky
      scroll={{ x: '100px' }}
      formRef={ref}
      request={async (params, sort) => {
        if (params.createdDates) {
          params.createdDates[0] = moment(params.createdDates[0]).format("YYYY-MM-DDTHH:mm:ss")
          params.createdDates[1] = moment(params.createdDates[1]).format("YYYY-MM-DDTHH:mm:ss")
        }
        const { data, success } = await getAgingReport(params, sort);
        data.headerData = formatData(data.headerData)
        console.log(data.headerData);
        data.records.forEach((e, i) => {
          if (e.finish === '未完成') {
            data.records[i].finish = 'false'
          }
        })
        console.log(data);

        setNodeColumns(data?.headerData || []);
        return {
          success: success,
          data: data.records,
          total: data.total,
          // intfStDatetimes: ['2022-11-11T10:33:41.436', '2022-11-30T10:33:41.436'],
        };
      }}
      pagination={{
        showSizeChanger: true,
      }}
      columns={newColumns}
    />
    // </PageContainer>
  );
};

export default TableList;
