import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="layout" data-open={isOpen}>
      <Sidebar onToggle={() => setIsOpen(!isOpen)} />
      <div className="layout__main">{children}</div>
    </div>
  );
};
