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
