import { useState } from 'react';
import type { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import InterfaceIntegrate from './components/InterfaceIntegrate';
import PrescriptionIntegrate from './components/PrescriptionIntegrate';
import AverageStatistics from './components/AverageStatistics';

export const TableList: FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('interfaceIntegrate');
  return (
    <PageContainer
      tabActiveKey={tabActiveKey}
      onTabChange={(key) => setTabActiveKey(key)}
      tabList={[
        { tab: '接口维度整合', key: 'interfaceIntegrate' },
        { tab: '按时效维度整合', key: 'prescriptionIntegrate' },
        { tab: '平均时效基数统计', key: 'averageStatistics' },
      ]}
    >
      {tabActiveKey === 'interfaceIntegrate' ? <InterfaceIntegrate /> : null}
      {tabActiveKey === 'prescriptionIntegrate' ? <PrescriptionIntegrate /> : null}
      {tabActiveKey === 'averageStatistics' ? <AverageStatistics /> : null}
    </PageContainer>
  );
};

export default TableList;
