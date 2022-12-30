import { findAllByDictCode } from '@/services/dictionary';

export default {
  namespace: 'dictionary',
  state: {},
  effects: {
    *findAllByDictCode({ payload: { code } }, { call, put, select }) {
      const dictionary = select((state: any) => state.dictionary);
      dictionary[code] = dictionary[code] || [];
      if (dictionary[code].length > 0) return;

      const response = yield call(findAllByDictCode, code);
      if (response.success) {
        yield put({
          type: 'save',
          payload: {
            ...dictionary,
            [code]: response.data,
          },
        });
      }
    },
  },
  reducers: {
    save(state: any, action: any) {
      return { ...state, ...action.payload };
    },
  },
};
