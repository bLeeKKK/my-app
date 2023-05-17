import {
  Redirect,
  useParams,
  useHistory,
  useLocation,
  useAccess,
  useRouteMatch,
  Access,
} from 'umi';
import { Button, Result } from 'antd';

export default (props) => {
  const access = useAccess();
  const routeMatch = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  console.log(access, routeMatch, history, location, params);
  if (access) {
    return (
      <Access
        accessible={access.canReadFoo}
        fallback={
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary">Back Home</Button>}
          />
        }
      >
        {props.children}
      </Access>
    );
  } else {
    return <Redirect to="/login" />;
  }
};
