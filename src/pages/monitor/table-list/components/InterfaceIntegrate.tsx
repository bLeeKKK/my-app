import type { FC } from 'react';
import { Fragment } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { TMoment, TBasicList, TBasicListItemDataType } from '../types.d';
import { useState } from 'react';
import { Table, Card, Radio, DatePicker, Button, Modal, message, Row, Col } from 'antd';
import { useRequest } from 'umi';
import {
  getInterfaceDimensionData,
  exportInterfaceDimensionData,
  statisticLastPeriodOverallData,
} from '../service';
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

const ShowLine = ({ data = [] }) => {
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
      return type === '平均' ? '#F4664A' : type === '最大' ? '#30BF78' : '#FAAD14';
    },
    lineStyle: ({ type }) => {
      if (type === '平均') {
        return {
          lineDash: [4, 4],
          opacity: 1,
        };
      }

      return { opacity: 0.5 };
    },
  };
  return <Line {...config} />;
};

// 接口维度整合
const InterfaceIntegrate: FC = () => {
  // 搜索参数
  const [date, setDate, typeDate, setTypeDate, stDate, endDate] = useDatePick();
  const [radioValue, setRadioValue] = useState('D');
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

  // 图表数据
  const { data: dataMap } = useRequest(() => statisticLastPeriodOverallData(radioValue), {
    refreshDeps: [radioValue],
  });

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
        {dataMap?.map((res) => (
          <Fragment key={res.intfTag}>
            <Row gutter={[8, 8]} style={{ marginTop: '16px' }}>
              <Col span={24}>
                <Card title={res.intfTag}>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <h3>事件时效</h3>
                      <ShowLine
                        data={res.eventAgingList?.map((res) => {
                          return {
                            ...res,
                            type: changeToStr(res.type),
                          };
                        })}
                      />
                    </Col>
                    <Col span={12}>
                      <h3>接口时效</h3>
                      <ShowLine
                        data={res.intfAgingList?.map((res) => {
                          return {
                            ...res,
                            type: changeToStr(res.type),
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
    line: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <RadioGroup
          optionType="button"
          value={radioValue}
          onChange={(event) => {
            setRadioValue(event.target.value);
          }}
          options={[
            {
              label: '天',
              value: 'D',
            },
            {
              label: '小时',
              value: 'H',
            },
            {
              label: '分钟',
              value: 'MI',
            },
          ]}
        />
      </div>
    ),
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
