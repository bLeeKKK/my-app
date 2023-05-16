import type { FC } from 'react';
import { useState, useEffect, Fragment } from 'react';
import { Card, Radio, Select, Row, Col, Empty } from 'antd';
import styles from '../style.less';
import { useDispatch, useSelector } from 'umi';
import { useRequest } from 'umi';
import { statisticRealTimeAverageData } from '../service';
// import { useUpdateEffect } from 'ahooks';
import ShowLine from './ShowLine';

const RadioGroup = Radio.Group;

// 按时效维度整合
const StatisticsSys: FC = () => {
  // 搜索参数
  const [radioValue, setRadioValue] = useState('D');
  const [sys, setSys] = useState('USO');
  const { source_sys, period_type } = useSelector((state) => state.dictionary);
  const dispatch = useDispatch();
  const { data: dataMap, run } = useRequest((params) => statisticRealTimeAverageData(params), {
    refreshDeps: [radioValue, sys],
    manual: true,
  });

  useEffect(() => {
    dispatch({ type: 'dictionary/findAllByDictCode', payload: { code: 'source_sys' } });
    dispatch({ type: 'dictionary/findAllByDictCode', payload: { code: 'period_type' } });
  }, [dispatch]);

  useEffect(() => {
    run({ periodType: radioValue, sendSystem: sys });
  }, [radioValue, run, sys]);

  const extraContent = (
    <div className={styles['extra-content']}>
      <Select
        placeholder="系统"
        style={{ width: '100px' }}
        onChange={(val) => setSys(val)}
        value={sys}
        options={source_sys?.map(({ name: label, value }) => ({ label, value }))}
      />
      <RadioGroup
        optionType="button"
        value={radioValue}
        onChange={(event) => {
          setRadioValue(event.target.value);
        }}
        options={period_type?.map(({ name: label, value }) => ({ label, value }))}
      />
    </div>
  );

  return (
    <Card
      className={styles['standard-list']}
      bordered={false}
      title="统计图表"
      // style={{ marginTop: 24 }}
      bodyStyle={{ padding: '0 32px 40px 32px' }}
      extra={extraContent}
    >
      {dataMap?.length ? (
        dataMap?.map((res) => (
          <Fragment key={res.intfTag}>
            <Row gutter={[8, 8]} style={{ marginTop: '16px' }}>
              <Col span={24}>
                <Card title={res?.sendSystem}>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <h3>事件时效</h3>
                      <ShowLine data={res?.intfAgingAveList} />
                    </Col>
                    <Col span={12}>
                      <h3>接口时效</h3>
                      <ShowLine data={res?.successRateAveList} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Fragment>
        ))
      ) : (
        <Empty />
      )}
    </Card>
  );
};

export default StatisticsSys;
