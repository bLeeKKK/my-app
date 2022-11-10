import { RequestConfig } from 'umi';

export const request: RequestConfig = {
  timeout: 1000,
  middlewares: [],
  requestInterceptors: [],
  responseInterceptors: [],
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,

        // showType?: number; // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
        showType: 2,
        errorMessage: resData.message,
      };
    },
  },
};
