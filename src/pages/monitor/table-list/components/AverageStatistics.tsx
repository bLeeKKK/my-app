import React, { useState, Fragment } from 'react';
import type { FC } from 'react';
import { Table, Card, Radio, DatePicker, Button, Modal, message, Empty, Row, Col } from 'antd';
// import type { ColumnsType } from 'antd/es/table';
import { useRequest } from 'umi';
import {
  getOverallDataAverage,
  exportOverallDataAverage,
  statisticRealTimeSystemDataList,
} from '../service';
import type { TDate } from '../types.d';
import styles from '../style.less';
import moment from 'moment';
import type { Moment } from 'moment';
import { download } from '@/utils';
import ShowLine from './ShowLine';

const changeToStr = (type) => {
  switch (type) {
    case 'avg':
      return '平均';
    case 'min':
      return '最小';
    case 'max':
      return '最大';
    default:
      return type;
  }
};

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;
const redDiv = (dom: React.ReactNode) => (
  <div style={{ backgroundColor: 'red', color: '#fff', paddingLeft: '8px' }}>{dom}</div>
);
const greenDiv = (dom: React.ReactNode) => (
  <div style={{ backgroundColor: 'green', color: '#fff', paddingLeft: '8px' }}>{dom}</div>
);
const ranges = {
  // 零点到结束
  过去7天: [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
  过去15天: [moment().subtract(14, 'days').startOf('day'), moment().endOf('day')],
  过去30天: [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
  上月: [
    moment().subtract(1, 'month').startOf('month'),
    moment().subtract(1, 'month').endOf('month'),
  ],
  过去90天: [moment().subtract(89, 'days').startOf('day'), moment().endOf('day')],
  // 这个月第一天零点到最后一天23:59:59
};
const tabListNoTitle = [
  {
    key: 'line',
    tab: '图表',
  },
  {
    key: 'list',
    tab: '基本列表',
  },
];

// 时间处理
const getPeriod = (text: string | number, typeDate: TDate, noDate: boolean = false) => {
  const timer = Number(text);
  if (typeDate === 'W') {
    // 一年第几周
    const week = moment(timer).week();
    // 当前时间周一
    const monday = moment(timer).startOf('week').format('YYYY-MM-DD');
    // 当前时间周日
    const sunday = moment(timer).endOf('week').format('YYYY-MM-DD');
    return `${week}周${noDate ? '' : `（${monday}~${sunday}）`}`;
  } else if (typeDate === 'M') {
    // 一年第几月
    const month = moment(timer).month() + 1;
    // 当前时间月份第一天
    const firstDay = moment(timer).startOf('month').format('YYYY-MM-DD');
    // 当前时间月份最后一天
    const lastDay = moment(timer).endOf('month').format('YYYY-MM-DD');
    return `${month}月${noDate ? '' : `（${firstDay}~${lastDay}）`}`;
  } else {
    return moment(timer).format('YYYY-MM-DD');
  }
};

// 按时效维度整合
const AverageStatistics: FC = () => {
  // 搜索参数
  const [activeTabKey, setActiveTabKey] = useState('line');
  const [typeDate, setTypeDate] = useState<TDate>('W');
  const [date, setDate] = useState<Moment[]>([
    moment().subtract(1, 'week').startOf('week'),
    moment().subtract(1, 'week').endOf('week'),
  ]);
  let stDate = moment(date?.[0]).format('YYYY-MM-DD HH:mm:ss');
  let endDate = moment(date?.[1]).format('YYYY-MM-DD HH:mm:ss');
  if (typeDate === 'M') {
    stDate = moment(date?.[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    endDate = moment(date?.[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss');
  } else if (typeDate === 'W') {
    stDate = moment(date?.[0]).startOf('week').format('YYYY-MM-DD HH:mm:ss');
    endDate = moment(date?.[1]).endOf('week').format('YYYY-MM-DD HH:mm:ss');
  }
  const { data } = useRequest(
    () => getOverallDataAverage({ periodType: typeDate, stDate, endDate }),
    { refreshDeps: [typeDate, date] },
  );

  let picker: string | undefined = undefined;
  if (typeDate === 'W') picker = 'week';
  if (typeDate === 'M') picker = 'month';
  // @ts-ignore
  const extraContent = (
    <div className={styles['extra-content']}>
      <Button
        onClick={() => {
          Modal.confirm({
            title: '提示',
            content: '确定要导出数据吗？',
            onOk: () => {
              exportOverallDataAverage({ periodType: typeDate, stDate, endDate })
                .then((res) => {
                  console.log(res);
                  const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                  const fileName = `接口维度数据${moment().format('YYYYMMDDHHmmss')}.xls`;
                  download(blob, fileName);
                })
                .catch((err) => {
                  message.error(err.message);
                });
            },
          });
        }}
      >
        导出报表
      </Button>
      <RadioGroup value={typeDate} onChange={(val) => setTypeDate(val.target.value)}>
        <RadioButton value="W">周</RadioButton>
        <RadioButton value="M">月份</RadioButton>
      </RadioGroup>
      <RangePicker
        className={styles.search}
        ranges={ranges}
        picker={picker}
        value={date}
        onChange={(val) => setDate(val)}
      />
    </div>
  );
  // 图表数据
  const { data: dataMap } = useRequest(
    () =>
      statisticRealTimeSystemDataList({
        endDate,
        stDate,
        periodType: typeDate,
      }),
    {
      refreshDeps: [stDate, endDate],
    },
  );

  const obj = {};
  (data?.records || []).forEach(({ period, statistic }: unknown) => {
    statistic.forEach((item: unknown) => {
      const group = obj[item.intfTag];
      if (group) {
        group.arr.push({ period, ...item });
      } else {
        obj[item.intfTag] = {
          text: item.intfDescription,
          tag: item.intfTag,
          arr: [{ period, ...item }],
        };
      }
    });
  });

  const showArr = Object.keys(obj);

  const extraContentExtra = {
    list: extraContent,
    line: (
      <>
        <RadioGroup value={typeDate} onChange={(val) => setTypeDate(val.target.value)}>
          <RadioButton value="W">周</RadioButton>
          <RadioButton value="M">月份</RadioButton>
        </RadioGroup>
        <RangePicker
          className={styles.search}
          ranges={ranges}
          picker={picker}
          value={date}
          onChange={(val) => setDate(val)}
        />
      </>
    ),
  };

  console.log(dataMap);
  const contentListNoTitle = {
    line: (
      <>
        {dataMap?.map((res) => (
          <Fragment key={res.intfTag}>
            <Row gutter={[8, 8]} style={{ marginTop: '16px' }}>
              <Col span={24}>
                <Card title={res.intfTag}>
                  <Row gutter={[16, 8]}>
                    <Col span={8}>
                      <h3>成功率</h3>
                      {/* <ShowLine
                        data={res.eventAgingList?.map((res) => {
                          return {
                            ...res,
                            type: changeToStr(res.type),
                          };
                        })}
                      /> */}
                    </Col>
                    <Col span={8}>
                      <h3>事件结束</h3>
                      <ShowLine
                        data={res.eventAgingList?.map((res) => {
                          return {
                            ...res,
                            // type: changeToStr(res.type),
                          };
                        })}
                      />
                    </Col>
                    <Col span={8}>
                      <h3>纯接口时效</h3>
                      <ShowLine
                        data={res.intfAgingList?.map((res) => {
                          return {
                            ...res,
                            // type: changeToStr(res.type),
                          };
                        })}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Fragment>
        ))}
      </>
    ),
    list: (
      <>
        {showArr.length ? (
          showArr.map((item) => {
            const { text, tag, arr } = obj[item];

            return (
              <Table
                key={tag}
                className={styles['expanded-table']}
                bordered
                title={() => text}
                dataSource={arr}
                pagination={false}
                rowKey="period"
                size="small"
                sticky
              >
                <Column
                  title="周期"
                  dataIndex="period"
                  render={(t) => getPeriod(t, typeDate, true)}
                />
                <ColumnGroup title="成功率">
                  <Column
                    title="基数"
                    dataIndex="successRateAverageBase"
                    render={(t) => `${100 * (t || 0) + '%'}`}
                  />
                  <Column
                    title="数值"
                    dataIndex="successRate"
                    render={(t, { successRateAverageBase }) => {
                      const txt = `${100 * (t || 0) + '%'}`;
                      if (t > successRateAverageBase) return greenDiv(txt);
                      else if (t < successRateAverageBase) return redDiv(txt);
                      return txt;
                    }}
                  />
                </ColumnGroup>
                <ColumnGroup title="事件结束（s）">
                  <Column title="基数" dataIndex="eventAgingAverageBase" render={(t) => t || 0} />
                  <Column
                    title="数值"
                    dataIndex="eventAgingAverage"
                    render={(t, { eventAgingAverageBase }) => {
                      const num = (t / 1000).toFixed(2);
                      if (num < eventAgingAverageBase) return greenDiv(num);
                      else if (num > eventAgingAverageBase) return redDiv(num);
                      return num;
                    }}
                  />
                </ColumnGroup>
                <ColumnGroup title="纯接口时效（ms）">
                  <Column title="基数" dataIndex="intfAgingAverageBase" render={(t) => t || 0} />
                  <Column
                    title="数值"
                    dataIndex="intfAgingAverage"
                    render={(t, { intfAgingAverageBase }) => {
                      const num = t;
                      if (num < intfAgingAverageBase) return greenDiv(num);
                      else if (num > intfAgingAverageBase) return redDiv(num);
                      return num;
                    }}
                  />
                </ColumnGroup>
              </Table>
            );
          })
        ) : (
          <Empty />
        )}
      </>
    ),
  };

  return (
    <Card
      className={styles['standard-list']}
      bordered={false}
      // title="基本列表"
      style={{ marginTop: 24 }}
      bodyStyle={{ padding: '0 32px 40px 32px' }}
      // extra={extraContent}
      tabList={tabListNoTitle}
      activeTabKey={activeTabKey}
      tabBarExtraContent={extraContentExtra[activeTabKey]}
      onTabChange={(key: string) => {
        setActiveTabKey(key);
      }}
    >
      {contentListNoTitle[activeTabKey]}
    </Card>
  );
};

export default AverageStatistics;
