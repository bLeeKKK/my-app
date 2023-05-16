import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import type { RequestConfig } from 'umi';
import Footer from '@/components/Footer';
import PageContainerBox from '@/components/PageContainerBox';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import {
  PageLoading,
  // SettingDrawer
} from '@ant-design/pro-components';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { getInfo as queryCurrentUser } from './services/ant-design-pro/api';
import { getMenuData, getPageTitle } from '@ant-design/pro-components';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const authArr = ['/list/base-show/', '/others/base-show-list-b/']; // 不需要鉴权页面

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('请先登录');
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  /**
   *  补充：/list/base-show/?sourceCode=12 该页面不做鉴权校验
   *  代码：!authArr.some((res) => res === location.pathname)
   * */
  // 如果不是登录页面，执行
  const { location } = history;
  // console.log(location, !authArr.some((res) => res === location.pathname));
  if (
    history.location.pathname !== loginPath &&
    !authArr.some((res) => res === location.pathname)
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // 水印
    waterMarkProps: {
      content: initialState?.currentUser?.userName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      /**
       *  补充：/list/base-show/?sourceCode=12 该页面不做鉴权校验
       *  代码：!authArr.some((res) => res === location.pathname)
       * */
      // 如果没有登录，重定向到 login
      if (
        !initialState?.currentUser &&
        location.pathname !== loginPath &&
        !authArr.some((res) => res === location.pathname)
      ) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
        <Link to="/~docs" key="docs">
          <BookOutlined />
          <span>业务组件文档</span>
        </Link>,
      ]
      : [],
    // headerContentRender: () => <ProBreadcrumb />,
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态

    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      const { breadcrumbMap } = getMenuData(props.routes, { locale: true });
      // console.log(breadcrumbMap.get(props.location.pathname), breadcrumb, menuData);
      const routerConfig = breadcrumbMap.get(props.location.pathname);
      return (
        <>
          {/* routerConfig?.layout 为false 不在菜单内的页面不进行包裹 */}
          {routerConfig?.layout === false ? (
            children
          ) : (
            <PageContainerBox {...props}>{children}</PageContainerBox>
          )}

          {/* <PageContainerBox {...props}>{children}</PageContainerBox> */}
          {/* {!props.location?.pathname?.includes('/login') && isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  timeout: 300 * 1000, // 接口响应时间限制 10秒
  middlewares: [],
  requestInterceptors: [
    (url, options) => {
      const { noAuth = false, ...restConfig } = options;
      if (noAuth) {
        return restConfig;
      }
      const token = localStorage.getItem('token');
      if (token && restConfig.headers) restConfig.headers.Authorization = token;
      return {
        url,
        options,
      };
    },
  ],
  responseInterceptors: [],
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,

        // showType?: number; // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
        showType: 2,
        errorMessage: resData.message,
      };
    },
  },
};
