import type { EventValue } from 'rc-picker/lib/interface';
import type { Moment } from 'moment';
import { useState } from 'react';
import { message } from 'antd';
import moment from 'moment';
import type { TDate, TMoment } from '../types.d';

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}
type TRanges = Record<string, [EventValue<Moment>, EventValue<Moment>]>;
type IUseDatePick = (
  initVal?: TMoment,
  initType?: TDate,
) => [
  TMoment,
  React.Dispatch<React.SetStateAction<TMoment>>,
  TDate,
  React.Dispatch<React.SetStateAction<TDate>>,
  string,
  string,
];

// 下载文件
export const download = (blob: Blob, fileName: string) => {
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else {
    // IE10+下载
    if (navigator.msSaveBlob) {
      const oWin = navigator.msSaveBlob(blob, fileName);
      if (!oWin) {
        message.error('导出失败');
      }
    }
  }
};

// 快捷日期选择
export const ranges: TRanges = {
  过去7天: [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
  过去15天: [moment().subtract(14, 'days').startOf('day'), moment().endOf('day')],
  过去30天: [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
  上月: [
    moment().subtract(1, 'month').startOf('month'),
    moment().subtract(1, 'month').endOf('month'),
  ],
  过去90天: [moment().subtract(89, 'days').startOf('day'), moment().endOf('day')],
};

// 时间处理
export const getPeriod = (text: string | number, typeDate: TDate, noDate: boolean = false) => {
  const timer = Number(text);
  if (typeDate === 'W') {
    // 一年第几周
    const week = moment(timer).week();
    // 当前时间周一
    const monday = moment(timer).startOf('week').format('YYYY-MM-DD');
    // 当前时间周日
    const sunday = moment(timer).endOf('week').format('YYYY-MM-DD');
    return `${week}周${noDate ? '' : `（${monday}~${sunday}）`}`;
  } else if (typeDate === 'M') {
    // 一年第几月
    const month = moment(timer).month() + 1;
    // 当前时间月份第一天
    const firstDay = moment(timer).startOf('month').format('YYYY-MM-DD');
    // 当前时间月份最后一天
    const lastDay = moment(timer).endOf('month').format('YYYY-MM-DD');
    return `${month}月${noDate ? '' : `（${firstDay}~${lastDay}）`}`;
  } else {
    return moment(timer).format('YYYY-MM-DD');
  }
};

// 时间日期搜索配置
const pickInit: TMoment = [
  moment().subtract(1, 'week').startOf('week'),
  moment().subtract(1, 'week').endOf('week'),
];
export const useDatePick: IUseDatePick = (initVal = pickInit, initType = 'W' as TDate) => {
  const [typeDate, setTypeDate] = useState<TDate>(initType);
  const [date, setDate] = useState<TMoment>(initVal);
  let stDate: string = moment(date?.[0]).format('YYYY-MM-DD HH:mm:ss');
  let endDate: string = moment(date?.[1]).format('YYYY-MM-DD HH:mm:ss');
  if (typeDate === 'M') {
    stDate = moment(date?.[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    endDate = moment(date?.[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss');
  } else if (typeDate === 'W') {
    stDate = moment(date?.[0]).startOf('week').format('YYYY-MM-DD HH:mm:ss');
    endDate = moment(date?.[1]).endOf('week').format('YYYY-MM-DD HH:mm:ss');
  }

  return [date, setDate, typeDate, setTypeDate, stDate, endDate];
};
