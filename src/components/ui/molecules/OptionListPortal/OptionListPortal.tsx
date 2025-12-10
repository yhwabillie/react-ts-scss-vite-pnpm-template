import React from 'react';
import { createPortal } from 'react-dom';

export type PortalPosition = { top: number; left: number; width: number };
type Props = {
  children: React.ReactNode;
  position: PortalPosition;
  isOpen: boolean;
  portalRef?: React.Ref<HTMLDivElement>;
};

const OptionListPortal: React.FC<Props> = ({ children, position, isOpen, portalRef }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      ref={portalRef}
      style={{
        position: 'absolute',
        top: position.top + 6,
        left: position.left,
        width: position.width,
        zIndex: 9999,
      }}
      className='option-portal'
    >
      {children}
    </div>,
    document.body,
  );
};

export default OptionListPortal;
