import type { FC } from 'react';
import { useState } from 'react';
import { Table, Card, Radio, DatePicker, Button, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRequest } from 'umi';
import { getInterfaceDimensionData, exportInterfaceDimensionData } from '../service';
import type { TDate } from '../types.d';
import styles from '../style.less';
import moment from 'moment';
import type { Moment } from 'moment';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Column } = Table;
const { RangePicker } = DatePicker;
const defaultColumn = { width: 100 };
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

const expandedRowRender = ({ statistic }: { statistic: unknown }) => {
  return (
    <>
      {statistic.map((res) => {
        const { intfTag, successRate, successRateLastPeriod, successRateDifference, ...rest } = res;
        // const iOne = { des: intfTag ,};
        const iTow = { des: '事件结束（秒）', ...rest };
        const iThree = { des: '纯接口时效（毫秒）', ...rest };
        const arr = [iTow, iThree];

        return (
          <Table
            key={res.intfTag}
            bordered
            size="small"
            dataSource={arr}
            pagination={false}
            sticky
            scroll={{ x: 1000 }}
            className={styles['expanded-table']}
            title={() => (
              <div>
                {res.intfDescription}（成功率：本期-{100 * (successRate || 0) + '%'}、上期-
                {100 * (successRateLastPeriod || 0) + '%'}、差值-
                {100 * (successRateDifference || 0) + '%'}）
              </div>
            )}
          >
            {/* 事件结束（秒） */}
            <Column title="描述" dataIndex="des" width={200} fixed />
            <Column
              title="平均"
              dataIndex="eventAgingAverage"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingAverage;
              }}
              {...defaultColumn}
            />
            <Column
              title="平均差值"
              dataIndex="eventAgingAverageDifference"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingAverageDifference;
              }}
              {...defaultColumn}
            />
            <Column
              title="上周平均"
              dataIndex="eventAgingAverageLastPeriod"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingAverageLastPeriod;
              }}
              {...defaultColumn}
            />
            <Column
              title="最长"
              dataIndex="eventAgingLongest"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingLongest;
              }}
              {...defaultColumn}
            />
            <Column
              title="最长差值"
              dataIndex="eventAgingLongestDifference"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingLongestDifference;
              }}
              {...defaultColumn}
            />
            <Column
              title="上周最长"
              dataIndex="eventAgingLongestLastPeriod"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingLongestLastPeriod;
              }}
              {...defaultColumn}
            />
            <Column
              title="最短"
              dataIndex="eventAgingShortest"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingShortest;
              }}
              {...defaultColumn}
            />
            <Column
              title="最短差值"
              dataIndex="eventAgingShortestDifference"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingShortestDifference;
              }}
              {...defaultColumn}
            />
            <Column
              title="上周最短"
              dataIndex="eventAgingShortestLastPeriod"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingShortestLastPeriod;
              }}
              {...defaultColumn}
            />
          </Table>
        );
      })}
    </>
  );
};

// 时间处理
const getPeriod = (text: string | number, typeDate: TDate) => {
  const timer = Number(text);
  if (typeDate === 'W') {
    // 一年第几周
    const week = moment(timer).week();
    // 当前时间周一
    const monday = moment(timer).startOf('week').format('YYYY-MM-DD');
    // 当前时间周日
    const sunday = moment(timer).endOf('week').format('YYYY-MM-DD');
    return `${week}周（${monday}~${sunday}）`;
  } else if (typeDate === 'M') {
    // 一年第几月
    const month = moment(timer).month() + 1;
    // 当前时间月份第一天
    const firstDay = moment(timer).startOf('month').format('YYYY-MM-DD');
    // 当前时间月份最后一天
    const lastDay = moment(timer).endOf('month').format('YYYY-MM-DD');
    return `${month}月（${firstDay}~${lastDay}）`;
  } else {
    return moment(timer).format('YYYY-MM-DD');
  }
};

// 接口维度整合
const InterfaceIntegrate: FC = () => {
  // 搜索参数
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
  const { data, loading } = useRequest(
    () => getInterfaceDimensionData({ periodType: typeDate, stDate, endDate }),
    { refreshDeps: [typeDate, date] },
  );

  const columns: ColumnsType<unknown> = [
    {
      title: '周期',
      dataIndex: 'period',
      render: (text) => getPeriod(text, typeDate),
    },
  ];

  let picker: string | undefined = undefined;
  if (typeDate === 'W') picker = 'week';
  if (typeDate === 'M') picker = 'month';
  const extraContent = (
    <div className={styles['extra-content']}>
      <Button
        onClick={() => {
          Modal.confirm({
            title: '提示',
            content: '确定要导出数据吗？',
            onOk: () => {
              exportInterfaceDimensionData({ periodType: typeDate, stDate, endDate })
                .then((res) => {
                  const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                  const fileName = `接口维度数据${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                  if ('download' in document.createElement('a')) {
                    // 非IE下载
                    const elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                  } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, fileName);
                  }
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

  return (
    <Card
      className={styles['standard-list']}
      bordered={false}
      title="基本列表"
      style={{ marginTop: 24 }}
      bodyStyle={{ padding: '0 32px 40px 32px' }}
      extra={extraContent}
    >
      <Table
        sticky
        style={{ marginTop: '16px' }}
        size="small"
        rowKey="period"
        pagination={false}
        expandable={{
          expandRowByClick: true,
          expandedRowRender,
        }}
        loading={loading}
        columns={columns}
        dataSource={data?.records || []}
        bordered
      />
    </Card>
  );
};

export default InterfaceIntegrate;
