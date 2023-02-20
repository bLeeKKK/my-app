import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
// import { useIntl } from 'umi';

const Footer: React.FC = () => {
  // const intl = useIntl();
  // // const defaultMessage = intl.formatMessage({
  // //   id: 'app.copyright.produced',
  // //   defaultMessage: '虹信技术部出品',
  // // });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${'虹信技术部出品'}`}
      links={[
        {
          key: 'Chang Hong Ecmp',
          title: 'ChangHong Ecmp',
          href: 'https://ecmp.changhong.com/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          // href: 'https://github.com/ant-design/ant-design-pro',
          href: 'http://gitlab.changhong.com/mofc/dfc-fl-web',
          blankTarget: true,
        },
        {
          key: 'ChangHong Sei',
          title: 'ChangHong Sei',
          href: 'https://sei.changhong.com/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
