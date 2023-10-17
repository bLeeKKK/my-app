import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';
import type { ParamsType, ShowDataType } from './data';

export async function edit(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzDataSourceConfig/edit`, {
    method: 'POST',
    data,
  });
}

export async function save(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzDataSourceConfig/save`, {
    method: 'POST',
    data,
  });
}

export async function list(data: any): Promise<{ data: ShowDataType[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzDataSourceConfig/list`, {
    method: 'POST',
    data,
  });
}
