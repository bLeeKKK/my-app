import { useLocation, MicroApp, MicroAppWithMemoHistory } from 'umi';
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
          tab: '全链路时效',
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
          tab: '全链路跟踪',
          children: (
            <div style={{ minHeight: '800px' }}>
              <MicroApp name="bizlog-web" sourceCode={sourceCode} sourceSys={sourceSys} />
            </div>
          ),
        },
        {
          key: '3',
          tab: '全链路数据表',
          children: (
            <div style={{ minHeight: '800px' }}>
              {/* <MicroApp name="bizlog-web-2" sourceCode={sourceCode} sourceSys={sourceSys} history="hash" /> */}
              <MicroAppWithMemoHistory
              name="bizlog-web"
              url={`/LineShowCopy?sourceOrderkey=${sourceCode}&sourceSys=${sourceSys}`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
