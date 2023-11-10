import React from 'react';
import { message } from 'antd';
import { exportResult } from './service';
import moment from 'moment';

const dfcShowList = {
  namespace: 'dfcShowList',
  state: {
    name: 'dfcShowList',

    actionRef: React.createRef(),
    advancedRef: React.createRef(),
  },
  reducers: {},
  effects: {
    *exportResult({ payload }: any, { call }: any) {
      try {
        const data = yield call(exportResult, payload);
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const fileName = `${payload.flowName}(${moment(payload.executeBeginTime).format(
          'YY-MM-DD',
        )}).xlsx`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      } catch (e: any) {
        message.error(e.message);
      }
    },
  },
  subscriptions: {
    setupHistory() {},
  },
};

export default dfcShowList;
