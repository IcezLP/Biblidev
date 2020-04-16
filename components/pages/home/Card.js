import React from 'react';
import { Card, Avatar, Tag, Typography, Badge } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

export default ({ resource }) => {
  const color = () => {
    if (resource.price === 'gratuit') return '#52c41a';
    if (resource.price === 'payant') return '#f5222d';
    if (resource.price === 'gratuit-et-payant') return '#fa8c16';
  };

  const site_url = process.env.SITE_URL.split('://').pop();

  return (
    <Badge
      count={
        <DollarOutlined style={{ color: color(), fontSize: '19px', top: '14px', right: '14px' }} />
      }
      className="resource"
    >
      <Card
        hoverable
        className="resource__card"
        bodyStyle={{
          height: '100%',
          display: 'flex',
          WebkitBoxOrient: 'vertical',
          WebkitBoxDirection: 'normal',
          flexDirection: 'column',
        }}
      >
        <a href={`${resource.link}?ref=${site_url}`} target="_blank" rel="noopener noreferrer">
          <Card.Meta
            className="resource__meta"
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
            avatar={
              resource.logo ? (
                <Avatar src={resource.logo} />
              ) : (
                <Avatar
                  style={{
                    backgroundColor: 'red',
                  }}
                >
                  {resource.name.charAt(0)}
                </Avatar>
              )
            }
          />
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
        </a>
      </Card>
    </Badge>
  );
};
