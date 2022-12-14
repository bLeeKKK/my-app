import React from 'react';

const dictionaryList = {
  namespace: 'dictionaryList',
  state: {
    name: 'dictionaryList',

    visible: false,
    edit: undefined, // 操作对象（编辑、查看）
    editType: undefined, // 1:新增 2:编辑 3:查看
    actionRef: React.createRef(),
    advancedRef: React.createRef(),

    // 详情
    visibleDetails: false,
    editDetails: undefined, // 操作对象（编辑、查看）
    editTypeDetails: undefined, // 1:新增 2:编辑 3:查看
    actionRefDetails: React.createRef(),
    advancedRefDetails: React.createRef(),
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
    setEditDetails(state, { payload: { visibleDetails = false, editDetails, editTypeDetails } }) {
      return {
        ...state,
        visibleDetails,
        editDetails,
        editTypeDetails,
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

export default dictionaryList;
