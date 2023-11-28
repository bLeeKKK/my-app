import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';

export const getSearchData = (data: any) => {
  // const asc = [];
  // const desc = [];
  // if (sort.eventStDatetime === 'descend') desc.push('event_st_datetime');
  // if (sort.eventEndDatetime === 'descend') desc.push('event_end_datetime');
  // if (sort.intfStDatetime === 'descend') desc.push('intf_st_datetime');
  // if (sort.intfEndDatetime === 'descend') desc.push('intf_end_datetime');
  // if (sort.eventFinishInterval === 'descend') desc.push('event_finish_interval');
  // if (sort.receiveDataInterval === 'descend') desc.push('receive_data_interval');
  //
  // if (sort.eventStDatetime === 'ascend') asc.push('event_st_datetime');
  // if (sort.eventEndDatetime === 'ascend') asc.push('event_end_datetime');
  // if (sort.intfStDatetime === 'ascend') asc.push('intf_st_datetime');
  // if (sort.intfEndDatetime === 'ascend') asc.push('intf_end_datetime');
  // if (sort.eventFinishInterval === 'ascend') asc.push('event_finish_interval');
  // if (sort.receiveDataInterval === 'ascend') asc.push('receive_data_interval');

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

export async function findByPage(params: any): Promise<{ data: any }> {
  const data = getSearchData(params);
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzResult/findByPage`, {
    method: 'POST',
    ...data,
  });
}

export async function exportResult(data: any): Promise<{ data: any }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/dfcdzResult/exportResult`, {
    responseType: 'blob',
    method: 'get',
    data,
    params: data,
  });
}
