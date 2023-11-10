import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';

export async function findByPage(data: any): Promise<{ data: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzFlowConfig/findByPage`, {
    method: 'POST',
    data,
    params: data,
  });
}

export async function save(data: any): Promise<{ data: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzFlowConfig/save`, {
    method: 'POST',
    data,
  });
}

export async function edit(data: any): Promise<{ data: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzFlowConfig/edit`, {
    method: 'POST',
    data,
  });
}

export async function findOne(params: any): Promise<{ params: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzFlowConfig/findOne`, {
    method: 'get',
    params,
  });
}

// 启用/禁用对账流程
export async function updateStatus(params: any): Promise<{ params: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzFlowConfig/updateStatus`, {
    method: 'get',
    params,
  });
}

export async function listSource(data: any): Promise<{ data: any[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzDataSourceConfig/list`, {
    method: 'POST',
    data,
  });
}

export async function findByPageModel(data: any): Promise<{ data: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzModel/findByPage`, {
    method: 'POST',
    data,
    params: data,
  });
}
