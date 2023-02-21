/** 服务接口基地址，默认是当前站点的域名地址 */
const BASE_DOMAIN = '';

/** 网关地址 */
const GATEWAY = '';

/**
 * 测试，开发环境接口配置
 */
const getServerPath = () => {
  if (process.env.NODE_ENV !== 'production') {
    // return '/local.api';
    return '';
  }
  return `${BASE_DOMAIN}${GATEWAY}`;
};

export const SERVER_PATH = getServerPath();
export const MOCKER_API = '/mocker.api';

// 模块
export const BIZLOG_CORE = 'bizlog-core';

// 模块
export const BIZLOG_REPORT_CORE = 'bizlog-report-inf';
