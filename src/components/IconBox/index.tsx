import { useState, useRef } from 'react';
import { Tooltip, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const IconText = ({ icon, text, click }: { icon: React.FC; text: string; click: any }) => (
  <Space onClick={click} style={{ cursor: 'pointer' }}>
    {icon}
    {text}
  </Space>
);

const IconBox = ({ useSpace = false, icon, text, timeOutClose, onClick, ...props }: any) => {
  const [inLoading, setInLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef();
  const Icon = icon;

  const click = (...args: any) => {
    const r = onClick(...args);
    if (r && r.then) {
      setInLoading(true);
      r.then(() => {
        setInLoading(false);
      });
    }
    return r;
  };

  const onOpenChange = (flag: boolean) => {
    setOpen(flag);
    if (timer.current || !flag) clearTimeout(timer.current);
    if (timeOutClose) timer.current = setTimeout(() => setOpen(false), timeOutClose);
  };

  const iconRender = inLoading ? <LoadingOutlined /> : <Icon {...props} />;

  return useSpace ? (
    <IconText icon={iconRender} text={text} click={click} />
  ) : (
    <Tooltip open={open} onClick={click} onOpenChange={onOpenChange} placement="top" title={text}>
      {iconRender}
    </Tooltip>
  );
};

export default IconBox;
