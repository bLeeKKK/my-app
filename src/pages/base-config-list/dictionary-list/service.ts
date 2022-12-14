import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH, MOCKER_API } from '@/services/constants';

type ParamsType = {};

export type { ParamsType };

// 字典目录-保存
export async function sysDictSave(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDict/save`, {
    method: 'POST',
    data,
  });
}

// 字典目录-更新
export async function sysDictUpdate(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDict/update`, {
    method: 'POST',
    data,
  });
}

// 字典目录-删除
export async function sysDictDelete(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDict/delete`, {
    method: 'GET',
    params: data,
  });
}

// 字典目录-分页查询
export async function sysDictfindByPage(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDict/findByPage`, {
    method: 'POST',
    data,
  });
}

// 字典详情-通过字典代码获取
export async function findAllByDictCode(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDictDetail/findAllByDictCode`, {
    method: 'GET',
    params: data,
  });
}

// 字典详情-保存
export async function sysDictDetailSave(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDictDetail/save`, {
    method: 'POST',
    data,
  });
}

// 字典详情-更新
export async function sysDictDetailUpdate(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDictDetail/update`, {
    method: 'POST',
    data,
  });
}

// 字典详情-删除
export async function sysDictDetailDelete(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDictDetail/delete`, {
    method: 'GET',
    params: data,
  });
}
