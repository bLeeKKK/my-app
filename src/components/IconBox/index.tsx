import { useState, useRef } from 'react';
import { Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const IconBox = ({ icon, text, timeOutClose, onClick, ...props }: any) => {
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
  return inLoading ? (
    <LoadingOutlined />
  ) : (
    <Tooltip open={open} onOpenChange={onOpenChange} placement="top" title={text}>
      <Icon {...props} onClick={click} />
    </Tooltip>
  );
};

export default IconBox;
