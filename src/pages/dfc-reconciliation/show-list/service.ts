import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';

export async function findByPage(data: any): Promise<{ data: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzResult/findByPage`, {
    method: 'POST',
    data,
    params: data,
  });
}

export async function exportResult(data: any): Promise<{ data: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzResult/exportResult`, {
    responseType: 'blob',
    method: 'get',
    data,
    params: data,
  });
}
