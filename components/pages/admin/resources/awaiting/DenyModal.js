import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export default ({ name, id }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        className="control__button"
        type="primary"
        danger
        icon={<CloseOutlined />}
        onClick={() => setVisible(true)}
      >
        Refuser
      </Button>
      <Modal key={`deny-${id}`} visible={visible} onCancel={() => setVisible(false)}>
        Deny {name}
      </Modal>
    </>
  );
};
