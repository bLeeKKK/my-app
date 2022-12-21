import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH, MOCKER_API } from '@/services/constants';

type ParamsType = {};

export type { ParamsType };

export async function save(data: ParamsType): Promise<{ data: unknown[] }> {
  console.log('data', data);
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysRole`, {
    method: data?.roleId ? 'PUT' : 'POST',
    data,
  });
}

type TConfigTableData = {
  success: boolean;
  message: string;
  data: {
    current: number;
    total: number;
    records: unknown[];
  };
};
// export async function selectIntfTag(params): Promise<TConfigTableData> {
//   return request(`${SERVER_PATH}/${BIZLOG_CORE}/interfaceAverageAgingConfig/selectIntfTag`, {
//     method: 'get',
//     params,
//   });
// }

// 分页查询
export async function findByPage(data): Promise<TConfigTableData> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysRole/list`, {
    method: 'post',
    data,
  });
}

// 删除
export async function deleteRole(roleId): Promise<TConfigTableData> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysRole/${roleId}`, {
    method: 'get',
  });
}
