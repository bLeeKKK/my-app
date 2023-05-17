import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH, MOCKER_API } from '@/services/constants';

export async function save(data) {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysUser`, {
    method: data?.userId ? 'PUT' : 'POST',
    data,
  });
}

// 分页查询
export async function findByPage(data) {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysUser/list`, {
    method: 'post',
    params: data,
    data,
  });
}

// 删除
export async function deleteUser(id): Promise<TConfigTableData> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysUser/${id}`, {
    method: 'delete',
  });
}

// 获取用户角色
export async function systemUser(id): Promise<TConfigTableData> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysUser/${id}`, {
    method: 'GET',
  });
}
