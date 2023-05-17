import { useAccess, Access } from 'umi';

export default function MyAccess({ children, aKey }: any) {
  const access = useAccess();
  const flag = access[aKey] || access['*:*:*'] === true;

  return <Access accessible={flag}>{children}</Access>;
}
