import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';

type ParamsType = {
  remark: string;
  sourceDbName: string;
  sourceFlag: boolean;
  sourceIp: string;
  sourceName: string;
  sourcePort: string;
  sourcePwd: string;
  sourceSystem: string;
  sourceType: string;
  sourceUserName: string;
  viewName: string;
};

export type { ParamsType };

export async function edit(data: ParamsType & { id: string }): Promise<{ data: unknown[] }> {
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
