import type { FC } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { Table, Card, Radio, DatePicker, Button, Modal, message } from 'antd';
import { useRequest } from 'umi';
import { getTimeDimensionDate, exportTimeDimensionDate } from '../service';
import { ranges, getPeriod, useDatePick } from '../utils';
import { download } from '@/utils';
import moment from 'moment';
import styles from '../style.less';
import { useUpdateEffect } from 'ahooks';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Column } = Table;
const { RangePicker } = DatePicker;

const expandedRowRender = ({
  statistic: { successRateVos, interfaceAgingVos, eventAgingVos },
}: {
  statistic: unknown;
}) => {
  return (
    <>
      {/* 成功率 */}
      <Table
        className={`${styles['expanded-table']} ${styles['expanded-table-pre-success']}`}
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
          title="上期成功率"
          dataIndex="successRateLastPeriod"
          width={100}
          render={(text) => 100 * (text || 0) + '%'}
        />
        <Column
          title="上期差率"
          dataIndex="successRateDifference"
          width={100}
          render={(text) => 100 * (text || 0) + '%'}
        />
      </Table>

      {/* 纯接口时效（毫秒） */}
      <Table
        className={`${styles['expanded-table']} ${styles['expanded-table-pre-intf']}`}
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
        <Column title="平均（ms）" dataIndex="intfAgingAverage" width={100} />
        <Column title="最长（ms）" dataIndex="intfAgingLongest" width={100} />
        <Column title="最短（ms）" dataIndex="intfAgingShortest" width={100} />
        <Column title="上周平均（ms）" dataIndex="intfAgingAverageLastPeriod" width={100} />
        <Column title="上周最长（ms）" dataIndex="intfAgingLongestLastPeriod" width={100} />
        <Column title="上周最短（ms）" dataIndex="intfAgingShortestLastPeriod" width={100} />
        <Column title="平均差值（ms）" dataIndex="intfAgingAverageDifference" width={100} />
        <Column title="最长差值（ms）" dataIndex="intfAgingLongestDifference" width={100} />
        <Column title="最短差值（ms）" dataIndex="intfAgingShortestDifference" width={100} />
      </Table>

      {/* 事件结束（秒） */}
      <Table
        className={`${styles['expanded-table']} ${styles['expanded-table-pre-event']}`}
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
        <Column
          title="平均（s）"
          dataIndex="eventAgingAverage"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
        <Column
          title="最长（s）"
          dataIndex="eventAgingLongest"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
        <Column
          title="最短（s）"
          dataIndex="eventAgingShortest"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
        <Column
          title="上周平均（s）"
          dataIndex="eventAgingAverageLastPeriod"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
        <Column
          title="上周最长（s）"
          dataIndex="eventAgingLongestLastPeriod"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
        <Column
          title="上周最短（s）"
          dataIndex="eventAgingShortestLastPeriod"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
        <Column
          title="平均差值（s）"
          dataIndex="eventAgingAverageDifference"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
        <Column
          title="最长差值（s）"
          dataIndex="eventAgingLongestDifference"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
        <Column
          title="最短差值（s）"
          dataIndex="eventAgingShortestDifference"
          width={100}
          render={(t) => (t / 1000).toFixed(2)}
        />
      </Table>
    </>
  );
};

// 按时效维度整合
const PrescriptionIntegrate: FC = () => {
  // 搜索参数
  const [date, setDate, typeDate, setTypeDate, stDate, endDate] = useDatePick();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
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

  useUpdateEffect(() => {
    const first = data?.records?.[0];
    if (first) setExpandedRowKeys([first.period]);
  }, [data]);

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
              exportTimeDimensionDate({ periodType: typeDate, stDate, endDate })
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
        onChange={(val) => setDate(val)}
      />
    </div>
  );

  return (
    <Card
      className={styles['standard-list']}
      bordered={false}
      title="基本列表"
      // style={{ marginTop: 24 }}
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

export default PrescriptionIntegrate;
