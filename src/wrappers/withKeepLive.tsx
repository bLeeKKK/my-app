import { KeepAlive } from 'react-activation';

const withKeepLive = (props: any) => {
  const { location, children } = props;
  return <KeepAlive name={location.pathname}>{children}</KeepAlive>;
};

export default withKeepLive;
