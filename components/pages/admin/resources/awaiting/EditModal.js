import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';

export default ({ name, id }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button className="control__button" icon={<EditOutlined />} onClick={() => setVisible(true)}>
        Éditer
      </Button>
      <Modal key={`edit-${id}`} visible={visible} onCancel={() => setVisible(false)}>
        Edit 
{' '}
{name}
      </Modal>
    </>
  );
};
