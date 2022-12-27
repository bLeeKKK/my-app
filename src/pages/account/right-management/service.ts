import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH, MOCKER_API } from '@/services/constants';

type ParamsType = {
  baseType: number; // 平均时效基数确认类型(自动基数:1,人工确认:0)
  eventFinishAverageBaseValue: number; // 事件结束平均基数值(秒)
  intfAgingAverageBaseValue: number; // 纯接口时效平均基数值(毫秒)
  intfDescription: number; // 接口描述
  intfTag: number; // 接口标识
  overallSuccessAverageBaseValue: number; // 整体成功率平均基数值
  lastMonthOverallSuccessAverageBaseValue: number; //上月整体成功率平均基数值
  lastMonthIntfAgingAverageBaseValue: number; //上月纯接口时效平均基数值(毫秒)
  lastMonthEventFinishAverageBaseValue: number; //上月事件结束平均基数值(秒)
};

export type { ParamsType };

export async function save(data: ParamsType): Promise<{ data: unknown[] }> {
  console.log('save data', data);
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysMenu`, {
    method: data?.menuId ? 'PUT' : 'POST',
    data,
  });
}

// 加载对应角色菜单列表树
export async function roleMenuTreeselect(roleId) {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysMenu/roleMenuTreeselect/${roleId}`, {
    method: 'GET',
  });
}

// 分页查询
export async function findByPage(data) {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysMenu/list`, {
    method: 'GET',
    data,
  });
}

// 树状
export async function treeselect() {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysMenu/treeselect`, {
    method: 'GET',
  });
}

// 删除
export async function deleteById(id) {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysMenu/${id}`, {
    method: 'DELETE',
  });
}
