import React from 'react';

const nodeTimerFlow = {
  namespace: 'nodeTimerFlow',
  state: {
    name: 'nodeTimerFlow',
    visible: false,
    edit: undefined, // 操作对象（编辑、查看）
    parent: undefined, // 默认 parent 为0
    editType: undefined, // 1:新增 2:编辑 3:查看

    actionRef: React.createRef(),
    advancedRef: React.createRef(),
  },
  reducers: {
    // 默认 parent 为0
    setEdit(state, { payload: { visible = false, edit, editType, parent } }) {
      return {
        ...state,
        visible,
        edit,
        editType,
        parent,
      };
    },
  },
  effects: {
    *GetProductGroupTree() {},
  },
  subscriptions: {
    setupHistory() {},
  },
};

export default nodeTimerFlow;
