import { message } from 'antd';
import moment from 'moment';

/**
 *  @description: 获取弹窗模式
 * @param {number} editType 模式 1:新增 2:编辑 3:查看
 */
export function getModel(editType: number | string) {
  switch (editType) {
    case 3:
      return '查看';
    case 2:
      return '编辑';
    case 1:
      return '新增';
    default:
      return '-';
  }
}

/**
 * @description: 下载文件流
 * @param {blob} blob 文件流
 * @param {string} fileName 文件名称
 */
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

// 两个时间差 时分秒
export const timeDiff = (startTime, endTime) => {
  const start = moment(startTime, 'YYYY-MM-DD HH:mm:ss');
  const end = moment(endTime, 'YYYY-MM-DD HH:mm:ss');
  const diff = end.diff(start);
  const duration = moment.duration(diff);
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours || 0}时${minutes || 0}分${seconds || 0}秒`;
};
