import type { FC } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { TMoment, TBasicList, TBasicListItemDataType } from '../types.d';
import { useState, useEffect } from 'react';
import { Table, Card, Radio, DatePicker, Button, Modal, message, Row, Col } from 'antd';
import { useRequest } from 'umi';
import { getInterfaceDimensionData, exportInterfaceDimensionData } from '../service';
import { ranges, getPeriod, useDatePick } from '../utils';
import { download } from '@/utils';
import { useUpdateEffect } from 'ahooks';
import moment from 'moment';
import { Line } from '@ant-design/plots';
import styles from '../style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Column } = Table;
const { RangePicker } = DatePicker;
const defaultColumn = { width: 100 };
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
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingAverage;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="最长"
              dataIndex="eventAgingLongest"
              render={(t, r, index) => {
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingLongest;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="最短"
              dataIndex="eventAgingShortest"
              render={(t, r, index) => {
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingShortest;
              }}
              {...defaultColumn}
            />

            <Column<TBasicListItemDataType>
              title="上期平均"
              dataIndex="eventAgingAverageLastPeriod"
              render={(t, r, index) => {
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingAverageLastPeriod;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="上期最长"
              dataIndex="eventAgingLongestLastPeriod"
              render={(t, r, index) => {
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingLongestLastPeriod;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="上期最短"
              dataIndex="eventAgingShortestLastPeriod"
              render={(t, r, index) => {
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingShortestLastPeriod;
              }}
              {...defaultColumn}
            />

            <Column<TBasicListItemDataType>
              title="平均差值"
              dataIndex="eventAgingAverageDifference"
              render={(t, r, index) => {
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingAverageDifference;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="最长差值"
              dataIndex="eventAgingLongestDifference"
              render={(t, r, index) => {
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingLongestDifference;
              }}
              {...defaultColumn}
            />
            <Column<TBasicListItemDataType>
              title="最短差值"
              dataIndex="eventAgingShortestDifference"
              render={(t, r, index) => {
                return index === 0 ? (t / 1000).toFixed(2) : r.intfAgingShortestDifference;
              }}
              {...defaultColumn}
            />
          </Table>
        );
      })}
    </>
  );
};

const ShowLine = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      {
        date: '2018/8/1',
        type: 'download',
        value: 4623,
      },
      {
        date: '2018/8/1',
        type: 'register',
        value: 2208,
      },
      {
        date: '2018/8/1',
        type: 'bill',
        value: 182,
      },
      {
        date: '2018/8/2',
        type: 'download',
        value: 6145,
      },
      {
        date: '2018/8/2',
        type: 'register',
        value: 2016,
      },
      {
        date: '2018/8/2',
        type: 'bill',
        value: 257,
      },
      {
        date: '2018/8/3',
        type: 'download',
        value: 508,
      },
      {
        date: '2018/8/3',
        type: 'register',
        value: 2916,
      },
      {
        date: '2018/8/3',
        type: 'bill',
        value: 289,
      },
      {
        date: '2018/8/4',
        type: 'download',
        value: 6268,
      },
      {
        date: '2018/8/4',
        type: 'register',
        value: 4512,
      },
      {
        date: '2018/8/4',
        type: 'bill',
        value: 428,
      },
      {
        date: '2018/8/5',
        type: 'download',
        value: 6411,
      },
      {
        date: '2018/8/5',
        type: 'register',
        value: 8281,
      },
      {
        date: '2018/8/5',
        type: 'bill',
        value: 619,
      },
      {
        date: '2018/8/6',
        type: 'download',
        value: 1890,
      },
      {
        date: '2018/8/6',
        type: 'register',
        value: 2008,
      },
      {
        date: '2018/8/6',
        type: 'bill',
        value: 87,
      },
      {
        date: '2018/8/7',
        type: 'download',
        value: 4251,
      },
      {
        date: '2018/8/7',
        type: 'register',
        value: 1963,
      },
      {
        date: '2018/8/7',
        type: 'bill',
        value: 706,
      },
      {
        date: '2018/8/8',
        type: 'download',
        value: 2978,
      },
      {
        date: '2018/8/8',
        type: 'register',
        value: 2367,
      },
      {
        date: '2018/8/8',
        type: 'bill',
        value: 387,
      },
      {
        date: '2018/8/9',
        type: 'download',
        value: 3880,
      },
      {
        date: '2018/8/9',
        type: 'register',
        value: 2956,
      },
      {
        date: '2018/8/9',
        type: 'bill',
        value: 488,
      },
      {
        date: '2018/8/10',
        type: 'download',
        value: 3606,
      },
      {
        date: '2018/8/10',
        type: 'register',
        value: 678,
      },
      {
        date: '2018/8/10',
        type: 'bill',
        value: 507,
      },
      {
        date: '2018/8/11',
        type: 'download',
        value: 4311,
      },
      {
        date: '2018/8/11',
        type: 'register',
        value: 3188,
      },
      {
        date: '2018/8/11',
        type: 'bill',
        value: 548,
      },
      {
        date: '2018/8/12',
        type: 'download',
        value: 4116,
      },
      {
        date: '2018/8/12',
        type: 'register',
        value: 3491,
      },
      {
        date: '2018/8/12',
        type: 'bill',
        value: 456,
      },
      {
        date: '2018/8/13',
        type: 'download',
        value: 6419,
      },
      {
        date: '2018/8/13',
        type: 'register',
        value: 2852,
      },
      {
        date: '2018/8/13',
        type: 'bill',
        value: 689,
      },
      {
        date: '2018/8/14',
        type: 'download',
        value: 1643,
      },
      {
        date: '2018/8/14',
        type: 'register',
        value: 4788,
      },
      {
        date: '2018/8/14',
        type: 'bill',
        value: 280,
      },
      {
        date: '2018/8/15',
        type: 'download',
        value: 445,
      },
      {
        date: '2018/8/15',
        type: 'register',
        value: 4319,
      },
      {
        date: '2018/8/15',
        type: 'bill',
        value: 176,
      },
    ]);
  }, []);

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    seriesField: 'type',
    color: ({ type }) => {
      return type === 'register' ? '#F4664A' : type === 'download' ? '#30BF78' : '#FAAD14';
    },
    lineStyle: ({ type }) => {
      if (type === 'register') {
        return {
          lineDash: [4, 4],
          opacity: 1,
        };
      }

      return {
        opacity: 0.5,
      };
    },
  };
  return <Line {...config} />;
};

// 接口维度整合
const InterfaceIntegrate: FC = () => {
  // 搜索参数
  const [date, setDate, typeDate, setTypeDate, stDate, endDate] = useDatePick();
  const [activeTabKey, setActiveTabKey] = useState('line');
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

  // 功能按钮
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
        onChange={(val: TMoment) => setDate(val)}
      />
    </div>
  );

  // 展示数据
  const contentListNoTitle = {
    line: (
      <>
        <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
          <Col span={12}>
            <Card title="Card title">
              <ShowLine />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Card title">
              <ShowLine />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Card title">
              <ShowLine />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Card title">
              <ShowLine />
            </Card>
          </Col>
        </Row>
      </>
    ),
    list: (
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
    ),
  };

  const extraContentExtra = {
    list: extraContent,
  };

  return (
    <Card
      className={styles['standard-list']}
      bordered={false}
      style={{ marginTop: 24 }}
      bodyStyle={{ padding: '0 32px 40px 32px' }}
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

export default InterfaceIntegrate;
