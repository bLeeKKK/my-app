import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';
import type { TDate, TBasicList } from './types.d';

type ParamsType = {
  endDate?: string;
  intfTag?: string;
  periodType?: TDate;
  stDate?: string;
} & Partial<unknown>;

export type TPageData<data> = {
  records: data;
};

export async function statisticOverallData(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/overallData`, {
    method: 'POST',
    data,
  });
}

// 按接口维度整合-整体数据
export async function getInterfaceDimensionData(
  data: ParamsType,
): Promise<{ data: TPageData<TBasicList[]> }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/getInterfaceDimensionData`, {
    method: 'POST',
    data,
  });
}

// 导出按接口维度整合-整体数据
export async function exportInterfaceDimensionData(data: ParamsType): Promise<BlobPart> {
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

// 按接口维度整合-时分秒
export async function statisticLastPeriodOverallData(periodType) {
  return request(
    `${SERVER_PATH}/${BIZLOG_CORE}/statisticInterfaceDimensionData/statisticLastPeriodOverallData/${periodType}`,
    {
      method: 'GET',
    },
  );
}
