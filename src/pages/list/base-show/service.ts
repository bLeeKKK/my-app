import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';

// 导出接口记录池数据
export async function findSourceCode(params) {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/fullLinkRecord/findSourceCode`, {
    method: 'get',
    params,
  });
}
