import { useLocation } from 'umi';
import { findSourceCode } from './service';
import { useRequest } from 'ahooks';
import ShowBox from '../base-show-list/components/ShowBox';

export default function BaseShow() {
  const { query } = useLocation();
  const sourceCode = query?.sourceCode;
  const { data } = useRequest(() => findSourceCode({ sourceCode }), {
    refreshDeps: [sourceCode],
  });

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <ShowBox data={data?.data} />
    </div>
  );
}
