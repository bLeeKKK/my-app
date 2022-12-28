import type { RangeValue } from 'rc-picker/lib/interface';
import type { Moment } from 'moment';

// 日期配置类型
export type TDate = 'W' | 'M';
export type TMoment = RangeValue<Moment>;

export type TBasicListItemDataType = {
  eventAgingAverage: number; // 事件结束（秒））-平均
  eventAgingAverageDifference: number; // 事件结束（秒））-平均差值
  eventAgingAverageLastPeriod: number; // 事件结束（秒））-上周平均
  eventAgingLongest: number; // 事件结束（秒））-最长
  eventAgingLongestDifference: number; // 事件结束（秒））-最长差值
  eventAgingLongestLastPeriod: number; // 事件结束（秒））-上周最长
  eventAgingShortest: number; // 事件结束（秒））-最短
  eventAgingShortestDifference: number; // 事件结束（秒））-最短差值
  eventAgingShortestLastPeriod: number; // 事件结束（秒））-上周最短
  intfAgingAverage: number; // 纯接口时效（毫秒）-平均
  intfAgingAverageDifference: number; // 纯接口时效（毫秒）-平均差值
  intfAgingAverageLastPeriod: number; // 纯接口时效（毫秒）-上周平均
  intfAgingLongest: number; // 纯接口时效（毫秒）-最长
  intfAgingLongestDifference: number; // 纯接口时效（毫秒）-最长差值
  intfAgingLongestLastPeriod: number; // 纯接口时效（毫秒）-上周最长
  intfAgingShortest: number; // 纯接口时效（毫秒）-最短
  intfAgingShortestDifference: number; // 纯接口时效（毫秒）-最短差值
  intfAgingShortestLastPeriod: number; // 纯接口时效（毫秒）-上周最短
  intfDescription: string | null; // 接口描述
  intfSuccessTotal: number | null;
  intfTag: string | null; // 接口标识
  intfTotal: number | null;
  receiveSystem: string | null; // 接收系统
  sendSystem: string | null; // 发送系统
  successRate: number; // 整体成功率百分比
  successRateDifference: number; // 整体成功率百分比-百分比差值
  successRateLastPeriod: number; // 整体成功率百分比 -上周百分比
};

export type TBasicList = {
  period: string;
  statistic: TBasicListItemDataType[];
};
