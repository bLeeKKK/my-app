import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH, MOCKER_API } from '@/services/constants';

type ParamsType = {};

export type { ParamsType };

export async function save(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/nodeValidityPeriodConfig`, {
    method: 'POST',
    data,
  });
}

export async function update(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/nodeValidityPeriodConfig`, {
    method: 'put',
    data,
  });
}

// 流程配置-分页查询
export async function findByPage(data: ParamsType): Promise<{ success: boolean; data: unknown }> {
  const { current, pageSize, ...rest } = data;

  return request(`${SERVER_PATH}/${BIZLOG_CORE}/nodeValidityPeriodConfig/findByPage`, {
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

// 流程配置-分页查询
export async function findByParent(parent = 0, data = {}) {
  // const { current, pageSize, ...rest } = data;

  return request(`${SERVER_PATH}/${BIZLOG_CORE}/nodeValidityPeriodConfig/findByParent/${parent}`, {
    method: 'get',
    data,
    // params: {
    //   current,
    //   size: pageSize,
    //   delFlag: 0,
    //   free: 0,
    // },
  });
}

// 流程配置-冻结
export async function nodeValidityPeriodConfigFreeze(
  data: ParamsType,
): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/nodeValidityPeriodConfig/freeze`, {
    method: 'GET',
    params: data,
  });
}
// 流程配置-冻结
export async function nodeValidityPeriodConfigDelete(id: string): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/nodeValidityPeriodConfig/${id}`, {
    method: 'DELETE',
  });
}

// 获取所有小节点
export async function findAllSmallNode() {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/nodeValidityPeriodConfigDetail/findAllSmallNode`, {
    method: 'GET',
    // params: data,
  });
}

// 获取所有小节点
export async function findByValidityPeriodCode(validityPeriodCode) {
  return request(
    `${SERVER_PATH}/${BIZLOG_CORE}/nodeValidityPeriodConfig/findByValidityPeriodCode/${validityPeriodCode}`,
    {
      method: 'GET',
      // params: data,
    },
  );
}
