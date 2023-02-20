export default {
  namespace: 'pageContainerBox',
  state: {
    tabList: [],
  },
  reducers: {
    setTabList(state, { payload }) {
      return {
        ...state,
        tabList: payload,
      };
    },
  },
  effects: {},
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, key }) => {
        dispatch({
          type: 'setTabList',
          payload: [],
        });
      });
    },
  },
};
