import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH } from '@/services/constants';

type ParamsType = {
  baseType: number; // 平均时效基数确认类型(自动基数:1,人工确认:0)
  eventFinishAverageBaseValue: number; // 事件结束平均基数值(秒)
  intfAgingAverageBaseValue: number; // 纯接口时效平均基数值(毫秒)
  intfDescription: number; // 接口描述
  intfTag: number; // 接口标识
  overallSuccessAverageBaseValue: number; // 整体成功率平均基数值
};

export type { ParamsType };

// 分页查询
export async function findByPage(data): Promise<TConfigTableData> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/interfaceCallRecord/findByPage`, {
    method: 'post',
    data,
  });
}
