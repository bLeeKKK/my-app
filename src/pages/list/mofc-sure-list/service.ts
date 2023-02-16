import { request } from 'umi';
import { SERVER_PATH, BIZLOG_REPORT_CORE } from '@/services/constants';

// 分页查询
export async function findByPage(data) {
  return request(`${SERVER_PATH}/${BIZLOG_REPORT_CORE}/deliverEbocLeftMofc/findAllByPage`, {
    method: 'post',
    data,
  });
}
