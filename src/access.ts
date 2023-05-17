import route from '../config/routes';
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: any } | undefined) {
  const { currentUser } = initialState ?? {};
  const permissions = currentUser?.permissions || [];
  if (permissions.includes('*:*:*')) return { '*:*:*': true }

  const accessObj = { login: true };
  const tree = (data) => {
    return (data || []).map((item) => {
      const { routes = [], access } = item;
      accessObj[access] = false;
      tree(routes);
    });
  };
  tree(route);

  for (const item of permissions) {
    Object.assign(accessObj, { [item]: true })
  }

  console.log('accessObj', accessObj);
  return accessObj;
}
