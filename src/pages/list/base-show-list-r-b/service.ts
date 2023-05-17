import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';

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

export const getSearchData = (data, sort) => {
  const asc = [];
  const desc = [];
  if (sort.eventStDatetime === 'descend') desc.push('event_st_datetime');
  if (sort.eventEndDatetime === 'descend') desc.push('event_end_datetime');
  if (sort.intfStDatetime === 'descend') desc.push('intf_st_datetime');
  if (sort.intfEndDatetime === 'descend') desc.push('intf_end_datetime');
  if (sort.eventFinishInterval === 'descend') desc.push('event_finish_interval');
  if (sort.receiveDataInterval === 'descend') desc.push('receive_data_interval');

  if (sort.eventStDatetime === 'ascend') asc.push('event_st_datetime');
  if (sort.eventEndDatetime === 'ascend') asc.push('event_end_datetime');
  if (sort.intfStDatetime === 'ascend') asc.push('intf_st_datetime');
  if (sort.intfEndDatetime === 'ascend') asc.push('intf_end_datetime');
  if (sort.eventFinishInterval === 'ascend') asc.push('event_finish_interval');
  if (sort.receiveDataInterval === 'ascend') asc.push('receive_data_interval');

  return {
    data,
    params: {
      size: data.pageSize,
      current: data.current,
      // desc: desc.join(','),
      // asc: asc.join(','),
    },
  };
};
// 分页查询
export async function findByPage(data, sort) {
  const search = getSearchData(data, sort);

  return request(`${SERVER_PATH}/${BIZLOG_CORE}/fullLinkRecord/findFullLinkRecordByPage`, {
    method: 'post',
    ...search,
  });
}

// 分页查询
export async function zonghe(data, sort) {
  const search = getSearchData(data, sort);

  return request(`${SERVER_PATH}/${BIZLOG_CORE}/fullLinkRecord/zongheReverse`, {
    method: 'post',
    ...search,
  });
}

// 导出接口记录池数据
export async function interfaceCallRecordExport(data: ParamsType): Promise<{ data: unknown[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/fullLinkRecord/export`, {
    method: 'POST',
    responseType: 'blob',
    data,
  });
}
