import { useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useHistory, useIntl, useLocation, MicroApp } from 'umi';
import { getMenuData, getPageTitle } from '@ant-design/pro-components';
import routes from '../../../config/routes';
import { useAliveController } from 'react-activation';
import './index.less';
// import { Tabs } from 'antd';

// const { TabPane } = Tabs;
function PageContainerBox({ children }: any) {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const { breadcrumb } = useMemo(
    () => getMenuData(routes, { locale: true }, (obj) => intl.formatMessage(obj)),
    [intl],
  );

  const { getCachingNodes, dropScope, refresh } = useAliveController();
  const cachingNodes = getCachingNodes();
  console.log(cachingNodes);

  const list = useMemo(() => {
    return cachingNodes.map(({ name }) => {
      const tab = getPageTitle({ pathname: name, breadcrumb });
      // return { label: tab, key: name };
      return {
        tab,
        key: name,
      };
    });
  }, [cachingNodes, breadcrumb]);

  // return (
  //   <>
  //     <Tabs
  //       type="editable-card"
  //       hideAdd
  //       onEdit={(targetKey, action) => {
  //         if (action === 'remove') {
  //           console.log(location.pathname, targetKey);
  //           if (location.pathname === targetKey) {
  //             dropScope(targetKey);
  //             // 前往排除当前 item 后的最后一个 tab
  //             history.push(list.filter((item) => item.key !== targetKey).pop()?.key || '/');
  //           } else {
  //             dropScope((targetKey as string) || '/');
  //           }
  //         }
  //       }}
  //     >
  //       {list.map((item) => (
  //         <TabPane tab={item.tab} key={item.key} closable={item.key !== '/'} />
  //       ))}
  //     </Tabs>
  //     {children}
  //   </>
  // );

  return (
    <PageContainer
      // fixedHeader
      // ghost
      header={{
        title: '',
        breadcrumb: {},
      }}
      tabList={list}
      tabActiveKey={history.location.pathname}
      onTabChange={(key) => history.push(key)}
      tabProps={{
        type: 'editable-card',
        hideAdd: true,
        onEdit: (targetKey, action) => {
          if (action === 'remove') {
            // 字典页面刷新问题尝试 refresh 这个方法

            if (location.pathname === targetKey) {
              dropScope(targetKey);
              // 前往排除当前 item 后的最后一个 tab
              history.push(list.filter((item) => item.key !== targetKey).pop()?.key || '/');
            } else {
              dropScope((targetKey as string) || '/');
            }
          }
        },
      }}
    >
      {/* <MicroApp name="app1" /> */}
      {children}
    </PageContainer>
  );
}

export default PageContainerBox;
