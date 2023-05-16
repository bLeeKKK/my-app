import { useState } from 'react';
import type { FC } from 'react';
import { Tabs } from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';
import InterfaceIntegrate from './components/InterfaceIntegrate';
import PrescriptionIntegrate from './components/PrescriptionIntegrate';
import AverageStatistics from './components/AverageStatistics';
import StatisticsSys from './components/StatisticsSys';
import styles from './style.less';

export const TableList: FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('interfaceIntegrate');
  return (
    <>
      <Tabs
        className={styles.tabs}
        onChange={(key) => setTabActiveKey(key)}
        activeKey={tabActiveKey}
        size="small"
      >
        <Tabs.TabPane tab="接口维度整合" key="interfaceIntegrate">
          <InterfaceIntegrate />
        </Tabs.TabPane>
        <Tabs.TabPane tab="按时效维度整合" key="prescriptionIntegrate">
          <PrescriptionIntegrate />
        </Tabs.TabPane>
        <Tabs.TabPane tab="平均时效基数统计" key="averageStatistics">
          <AverageStatistics />
        </Tabs.TabPane>
        <Tabs.TabPane tab="系统维度-图表" key="statisticsSys">
          <StatisticsSys />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
  // return (
  //   <PageContainer
  //     header={{
  //       title: '',
  //       ghost: true,
  //       breadcrumb: { routes: [] },
  //     }}
  //     tabActiveKey={tabActiveKey}
  //     onTabChange={(key) => setTabActiveKey(key)}
  //     tabProps={{
  //       className: 'page-tabs',
  //       style: { padding: 0 },
  //     }}
  //     tabList={[
  //       { tab: '接口维度整合', key: 'interfaceIntegrate' },
  //       { tab: '按时效维度整合', key: 'prescriptionIntegrate' },
  //       { tab: '平均时效基数统计', key: 'averageStatistics' },
  //       { tab: '系统维度-图表', key: 'statisticsSys' },
  //     ]}
  //   >
  //     {tabActiveKey === 'interfaceIntegrate' ? <InterfaceIntegrate /> : null}
  //     {tabActiveKey === 'prescriptionIntegrate' ? <PrescriptionIntegrate /> : null}
  //     {tabActiveKey === 'averageStatistics' ? <AverageStatistics /> : null}
  //     {tabActiveKey === 'statisticsSys' ? <StatisticsSys /> : null}
  //   </PageContainer>
  // );
};

export default TableList;
