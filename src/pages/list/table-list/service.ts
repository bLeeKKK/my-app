import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH, MOCKER_API } from '@/services/constants';
import type { TDate } from './types.d';

type ParamsType = {
  endDate?: string;
  intfTag?: string;
  periodType?: TDate;
  stDate?: string;
} & Partial<unknown>;

export async function statisticOverallData(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/overallData`, {
    method: 'POST',
    data,
  });
}

// 按接口维度整合-整体数据
export async function getInterfaceDimensionData(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/getInterfaceDimensionData`, {
    method: 'POST',
    data,
  });
}

// 导出按接口维度整合-整体数据
export async function exportInterfaceDimensionData(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/exportInterfaceDimensionData`, {
    method: 'POST',
    data,
  });
}

// 按时效维度整合
export async function getTimeDimensionDate(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/getTimeDimensionDate`, {
    method: 'POST',
    data,
  });
}

// 导出按接口维度整合-整体数据
export async function exportTimeDimensionDate(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/exportTimeDimensionDate`, {
    method: 'POST',
    data,
  });
}

// 平均时效基数统计
export async function getOverallDataAverage(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/getOverallDataAverage`, {
    method: 'POST',
    data,
  });
}

// 导出按接口维度整合-整体数据
export async function exportOverallDataAverage(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/exportOverallDataAverage`, {
    method: 'POST',
    data,
  });
}
