import { useLocation, MicroApp } from 'umi';
import { findSourceCode } from './service';
import { useRequest } from 'ahooks';
import ShowBox from '../base-show-list/components/ShowBox';
import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';

export default function BaseShow() {
  const { query } = useLocation();
  const sourceCode = query?.sourceCode;
  const sourceSys = query?.sourceSys;
  const { data } = useRequest(() => findSourceCode({ sourceCode, sourceSys }), {
    refreshDeps: [sourceCode, sourceSys],
  });

  const showArr = data?.data || [];
  return (
    <PageContainer
      // fixedHeader
      // ghost
      style={{ height: '100%', marginTop: '45px' }}
      header={{
        title: '',
        breadcrumb: {},
      }}
      tabList={[
        {
          key: '2',
          tab: '基础展示',
          children: (
            <div style={{ minHeight: '800px' }}>
              {showArr.length ? (
                showArr.map((item, index) => <ShowBox data={item} key={index} />)
              ) : (
                <Empty />
              )}
            </div>
          ),
        },
        {
          key: '1',
          tab: '链路数据',
          children: (
            <div style={{ minHeight: '800px' }}>
              <MicroApp name="bizlog-web" sourceCode={sourceCode} sourceSys={sourceSys} />
            </div>
          ),
        },
      ]}
    />
  );
}
