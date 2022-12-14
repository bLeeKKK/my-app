import { Tooltip } from 'antd';

const IconBox = ({ icon, text, ...props }) => {
  const Icon = icon;
  return (
    <Tooltip placement="top" title={text}>
      <Icon {...props} />
    </Tooltip>
  );
};

export default IconBox;
