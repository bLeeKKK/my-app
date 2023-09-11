import React from 'react';

const scmcMofcCompareAccountOfAllocateList = {
  namespace: 'scmcMofcCompareAccountOfAllocateList',
  state: {
    name: 'scmcMofcCompareAccountOfAllocateList',
    visible: false,
    edit: undefined, // 操作对象（编辑、查看）
    editType: undefined, // 1:新增 2:编辑 3:查看

    actionRef: React.createRef(),
    advancedRef: React.createRef(),
  },
  reducers: {
    setEdit(state, { payload: { visible = false, edit, editType } }) {
      return {
        ...state,
        visible,
        edit,
        editType,
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

export default scmcMofcCompareAccountOfAllocateList;
