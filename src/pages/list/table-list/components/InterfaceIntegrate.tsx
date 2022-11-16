import type { FC } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { TMoment, TBasicList, TBasicListItemDataType } from '../types.d';
import { useState } from 'react';
import { Table, Card, Radio, DatePicker, Button, Modal, message } from 'antd';
import { useRequest } from 'umi';
import { getInterfaceDimensionData, exportInterfaceDimensionData } from '../service';
import { download, ranges, getPeriod, useDatePick } from '../utils';
import { useUpdateEffect } from 'ahooks';
import moment from 'moment';
import styles from '../style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Column } = Table;
const { RangePicker } = DatePicker;
const defaultColumn = { width: 100 };

const expandedRowRender = (item: TBasicList) => {
  const { statistic } = item;
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
            className={`${styles['expanded-table']} ${styles['expanded-table-interface']}`}
            title={() => (
              <div>
                {res.intfDescription}（成功率&nbsp;本期：{100 * (successRate || 0) + '%'}、上期：
                {100 * (successRateLastPeriod || 0) + '%'}、差值：
                {100 * (successRateDifference || 0) + '%'}）
              </div>
            )}
          >
            {/* 事件结束（秒） */}
            <Column title="描述" dataIndex="des" width={200} fixed />
            <Column<TBasicListItemDataType>
              title="平均"
              dataIndex="eventAgingAverage"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingAverage;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="最长"
              dataIndex="eventAgingLongest"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingLongest;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="最短"
              dataIndex="eventAgingShortest"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingShortest;
              }}
              {...defaultColumn}
            />

            <Column<TBasicListItemDataType>
              title="平均差值"
              dataIndex="eventAgingAverageDifference"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingAverageDifference;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="最长差值"
              dataIndex="eventAgingLongestDifference"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingLongestDifference;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="最短差值"
              dataIndex="eventAgingShortestDifference"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingShortestDifference;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="上期平均"
              dataIndex="eventAgingAverageLastPeriod"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingAverageLastPeriod;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="上期最长"
              dataIndex="eventAgingLongestLastPeriod"
              render={(t, r, index) => {
                return index === 0 ? t : r.intfAgingLongestLastPeriod;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="上期最短"
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

// 接口维度整合
const InterfaceIntegrate: FC = () => {
  // 搜索参数
  const [date, setDate, typeDate, setTypeDate, stDate, endDate] = useDatePick();
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);
  const { data, loading } = useRequest(
    () => getInterfaceDimensionData({ periodType: typeDate, stDate, endDate }),
    { refreshDeps: [typeDate, date] },
  );
  const columns: ColumnsType<TBasicList> = [
    {
      title: '周期',
      dataIndex: 'period',
      render: (text) => getPeriod(text, typeDate),
    },
  ];

  useUpdateEffect(() => {
    const first = data?.records?.[0];
    if (first) setExpandedRowKeys([first.period]);
  }, [data]);

  let picker: 'week' | 'month' | undefined = undefined;
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
        onChange={(val: TMoment) => setDate(val)}
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
          expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) setExpandedRowKeys((keys) => [...keys, record.period]);
            else setExpandedRowKeys((keys) => keys.filter((key) => key !== record.period));
          },
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
