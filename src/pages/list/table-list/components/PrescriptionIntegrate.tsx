import { useState } from 'react';
import type { FC } from 'react';
import { Table, Card, Radio, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRequest } from 'umi';
import { getTimeDimensionDate } from '../service';
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

const expandedRowRender = ({
  statistic: { successRateVos, interfaceAgingVos, eventAgingVos },
}: {
  statistic: unknown;
}) => {
  return (
    <>
      {/* 成功率 */}
      <Table
        className={styles['expanded-table']}
        bordered
        title={() => '成功率'}
        dataSource={successRateVos}
        pagination={false}
        rowKey="intfTag"
        size="small"
      >
        <Column title="接口名称" dataIndex="intfDescription" width={200} fixed />
        <Column
          title="成功率"
          dataIndex="successRate"
          width={100}
          render={(text) => 100 * (text || 0) + '%'}
        />
        <Column
          title="上期差率"
          dataIndex="successRateDifference"
          width={100}
          render={(text) => 100 * (text || 0) + '%'}
        />
        <Column
          title="上期成功率"
          dataIndex="successRateLastPeriod"
          width={100}
          render={(text) => 100 * (text || 0) + '%'}
        />
      </Table>

      {/* 纯接口时效（毫秒） */}
      <Table
        className={styles['expanded-table']}
        bordered
        title={() => '纯接口时效（毫秒）'}
        dataSource={interfaceAgingVos}
        pagination={false}
        rowKey="intfTag"
        size="small"
        sticky
        scroll={{ x: 1300 }}
      >
        <Column title="接口名称" dataIndex="intfDescription" width={200} fixed />
        <Column title="平均" dataIndex="intfAgingAverage" width={120} />
        <Column title="平均差值（ms）" dataIndex="intfAgingAverageDifference" width={120} />
        <Column title="上周平均（ms）" dataIndex="intfAgingAverageLastPeriod" width={120} />
        <Column title="最长（ms）" dataIndex="intfAgingLongest" width={120} />
        <Column title="最长差值（ms）" dataIndex="intfAgingLongestDifference" width={120} />
        <Column title="上周最长（ms）" dataIndex="intfAgingLongestLastPeriod" width={120} />
        <Column title="最短（ms）" dataIndex="intfAgingShortest" width={120} />
        <Column title="最短差值（ms）" dataIndex="intfAgingShortestDifference" width={120} />
        <Column title="上周最短（ms）" dataIndex="intfAgingShortestLastPeriod" width={120} />
      </Table>

      {/* 事件结束（秒） */}
      <Table
        className={styles['expanded-table']}
        bordered
        title={() => '事件结束（秒）'}
        dataSource={eventAgingVos}
        pagination={false}
        rowKey="interfaceName"
        size="small"
        sticky
        scroll={{ x: 1300 }}
      >
        <Column title="接口名称" dataIndex="intfDescription" width={200} fixed />
        <Column title="平均（s）" dataIndex="eventAgingAverage" width={100} />
        <Column title="平均差值（s）" dataIndex="eventAgingAverageDifference" width={100} />
        <Column title="上周平均（s）" dataIndex="eventAgingAverageLastPeriod" width={100} />
        <Column title="最长（s）" dataIndex="eventAgingLongest" width={100} />
        <Column title="最长差值（s）" dataIndex="eventAgingLongestDifference" width={100} />
        <Column title="上周最长（s）" dataIndex="eventAgingLongestLastPeriod" width={100} />
        <Column title="最短（s）" dataIndex="eventAgingShortest" width={100} />
        <Column title="最短差值（s）" dataIndex="eventAgingShortestDifference" width={100} />
        <Column title="上周最短（s）" dataIndex="eventAgingShortestLastPeriod" width={100} />
      </Table>
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

// 按时效维度整合
const PrescriptionIntegrate: FC = () => {
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
    () => getTimeDimensionDate({ periodType: typeDate, stDate, endDate }),
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

export default PrescriptionIntegrate;
