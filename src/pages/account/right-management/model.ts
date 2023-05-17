import React from 'react';
import { message } from 'antd';
import { findById } from './service';

const rightManagement = {
  namespace: 'rightManagement',
  state: {
    name: 'rightManagement',
    visible: false,
    edit: undefined, // 操作对象（编辑、查看）
    editType: undefined, // 1:新增 2:编辑 3:查看
    parent: undefined, // 父级

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
        parent: undefined,
      };
    },
    setEditAndParent(state, { payload: { visible = false, edit, editType, parent } }) {
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
    *GetEditById({ payload }, { put, call }) {
      // console.log(payload);
      const { id } = payload;
      const hide = message.loading('正在查询...');
      const { success, data, msg } = yield call(findById, { id });
      hide();
      if (success) {
        yield put({
          type: 'setEdit',
          payload: {
            edit: data,
            visible: true,
            editType: 2,
          },
        });
      } else {
        message.error(msg);
      }
    },
  },
  subscriptions: {
    setupHistory() { },
  },
};

export default rightManagement;
