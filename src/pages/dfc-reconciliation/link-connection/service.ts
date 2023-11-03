import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';

export async function findByPage(data: any): Promise<{ data: any[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzModel/findByPage`, {
    method: 'POST',
    data,
    params: data,
  });
}

export async function list(data: any): Promise<{ data: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzDataSourceConfig/list`, {
    method: 'POST',
    data,
  });
}
