import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH, MOCKER_API } from '@/services/constants';

type ParamsType = {};

export type { ParamsType };

export async function save(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/businessFlowConfig/save`, {
    method: 'POST',
    data,
  });
}

export async function update(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/businessFlowConfig/update`, {
    method: 'POST',
    data,
  });
}

// 流程配置-分页查询
export async function findByPage(data: ParamsType): Promise<{ success: boolean; data: unknown }> {
  const { current, pageSize, ...rest } = data;

  return request(`${SERVER_PATH}/${BIZLOG_CORE}/businessFlowConfig/findByPage`, {
    method: 'POST',
    data: rest,
    params: {
      current,
      size: pageSize,
      delFlag: 0,
      free: 0,
    },
  });
}

// 流程配置-删除
export async function businessFlowConfigDelete(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/businessFlowConfig/freeze`, {
    method: 'GET',
    params: data,
  });
}
