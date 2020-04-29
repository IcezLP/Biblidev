import React, { useState } from 'react';
import { Card, Avatar, Tag, Typography, Badge, Rate, Row, Col, Button } from 'antd';
import { DollarOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import classnames from 'classnames';
import fetch from '../../../lib/fetch';
import { notify } from '../../../lib/notification';

export default ({ resource, user }) => {
  const [favorite, setFavorite] = useState(user && user.favorites.includes(resource._id));
  // const color = () => {
  //   if (resource.price === 'gratuit') return '#52c41a';
  //   if (resource.price === 'payant') return '#f5222d';
  //   if (resource.price === 'gratuit-et-payant') return '#fa8c16';
  // };

  const site_url = process.env.SITE_URL.split('://').pop();

  const handleFavorite = async () => {
    if (!user) {
      return notify('info', 'Vous devez être connecté pour effectuer cette action');
    }

    const response = await fetch('put', `/api/users/favorite/${user._id}/${resource._id}`);

    if (response.status === 'error') {
      return notify('error', response.message);
    }

    if (response.data.update === 'add') {
      return setFavorite(true);
    }

    if (response.data.update === 'remove') {
      return setFavorite(false);
    }
  };

  return (
    <Card className="resource" hoverable>
      <a href={`${resource.link}?ref=${site_url}`} target="_blank" rel="noopener noreferrer">
        <Card.Meta
          className="resource__meta"
          avatar={
            resource.logo ? (
              <Avatar
                size={32}
                src={`https://res.cloudinary.com/biblidev/image/upload/${resource.logo}`}
              />
            ) : (
              <Avatar
                size={32}
                style={{
                  backgroundColor: 'red',
                }}
              >
                {resource.name.charAt(0)}
              </Avatar>
            )
          }
          title={
            <>
              {resource.name}
              <br />
              <Typography.Text type="secondary" className="resource__author">
                Posté par&nbsp;
                {resource.author ? (
                  <span className="resource__author__username">{resource.author.username}</span>
                ) : (
                  'Anonyme'
                )}
              </Typography.Text>
            </>
          }
          description={resource.description}
        />
      </a>
      <div className="resource_categories">
        {resource.categories.map(
          (category) =>
            !(typeof category === 'string') && (
              <Tag key={category._id} className="resource__category">
                {category.name}
              </Tag>
            ),
        )}
      </div>
      <Button
        className={classnames('resource__favorite', { favorite })}
        shape="circle-outline"
        type="link"
        onClick={handleFavorite}
        icon={favorite ? <HeartFilled /> : <HeartOutlined />}
        size="large"
      />
    </Card>
  );
};
