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

export async function getInterfaceDimensionData(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/getInterfaceDimensionData`, {
    method: 'POST',
    data,
  });
}

export async function getTimeDimensionDate(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/getTimeDimensionDate`, {
    method: 'POST',
    data,
  });
}

export async function getOverallDataAverage(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/statistic/getOverallDataAverage`, {
    method: 'POST',
    data,
  });
}
