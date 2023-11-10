import React from 'react';
import { message } from 'antd';
import { updateStatus } from './service';

const linkConnection = {
  namespace: 'linkConnection',
  state: {
    name: 'linkConnection',
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
    *updateStatus({ payload, callback }: any, { call }: any) {
      try {
        const { success, message: msg } = yield call(updateStatus, payload);
        if (success) {
          message.success(msg);
          if (callback) callback();
        } else {
          message.error(msg);
        }
      } catch (e: any) {
        message.error(e.message);
      }
    },
  },
  subscriptions: {
    setupHistory() {},
  },
};

export default linkConnection;
