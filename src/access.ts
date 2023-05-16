/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: any } | undefined) {
  const { currentUser } = initialState ?? {};
  const permissions = currentUser?.permissions || [];
  if (permissions[0] === '*:*:*') {
    return {}
  }
  const accessObj = {
    login: true,
  };
  for (const i of permissions) {
    Object.assign(accessObj, { [i]: true });
  }
  return {};
}
