import React from 'react';
import { Card, Avatar, Col, Typography, Divider } from 'antd';
import Moment from 'react-moment';
import 'moment/locale/fr';

const { Title, Text } = Typography;
const { memo } = React;

const Profile = ({ user }) => (
  <Col xs={0} sm={7} lg={4} className="user-sidebar">
    <Card style={{ backgroundColor: '#f0f2f5' }} bodyStyle={{ maxWidth: '100%' }}>
      {user.avatar ? (
        <Avatar size={96} src={user.avatar} />
      ) : (
        <Avatar size={96}>{user.username.charAt(0).toUpperCase()}</Avatar>
      )}
      <Title level={3}>{user.username}</Title>
      {user.isAdmin && (
        <Text className="user-data-text" type="danger" code>
          Administrateur
        </Text>
      )}
      <Text className="user-data-text">
        Membre depuis&nbsp;
        <Moment fromNow ago local="fr">
          {user.createdAt}
        </Moment>
      </Text>
    </Card>
  </Col>
);

export default memo(Profile);
