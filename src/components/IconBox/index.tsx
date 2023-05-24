import { useState, useRef } from 'react';
import { Tooltip } from 'antd';

const IconBox = ({ icon, text, timeOutClose, ...props }) => {
  const [open, setOpen] = useState(false);
  const timer = useRef();
  const Icon = icon;

  const onOpenChange = (flag: boolean) => {
    setOpen(flag);
    if (timer.current || !flag) clearTimeout(timer.current);
    if (timeOutClose) timer.current = setTimeout(() => setOpen(false), timeOutClose);
  };
  return (
    <Tooltip open={open} onOpenChange={onOpenChange} placement="top" title={text}>
      <Icon {...props} />
    </Tooltip>
  );
};

export default IconBox;
