import React from 'react';
import { Card, Typography, Avatar, Tag, Button, Badge } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, DollarOutlined } from '@ant-design/icons';
import Moment from 'react-moment';
import 'moment/locale/fr';

export default ({ resource, onEdit, onCheck, onUserClick, onDeny }) => {
  const color = () => {
    if (resource.price === 'gratuit') return '#52c41a';
    if (resource.price === 'payant') return '#f5222d';
    if (resource.price === 'gratuit-et-payant') return '#fa8c16';
  };

  return (
    <div className="resource">
      <Typography.Text className="resource__header">
        Posté le&nbsp;
        <Moment locale="fr" format="DD MMMM YYYY">
          {resource.createdAt}
        </Moment>
        &nbsp;par&nbsp;
        {resource.author ? (
          <span
            className="resource__author"
            onClick={(event) => {
              event.preventDefault();
              onUserClick(resource.author._id);
            }}
          >
            {/* eslint-disable-next-line */}
            <b>{resource.author.username}</b> ({resource.author._id})
          </span>
        ) : (
          'Anonyme'
        )}
      </Typography.Text>
      <Badge
        count={
          <DollarOutlined
            style={{ color: color(), fontSize: '19px', top: '14px', right: '14px' }}
          />
        }
        className="resource__price"
      >
        <Card className="resource__card">
          <Card.Meta
            title={resource.name}
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
          <div className="resource__categories">
            {resource.categories.map(
              (category) =>
                !(typeof category === 'string') && (
                  <Tag key={category._id} className="resource__category">
                    {category.name}
                  </Tag>
                ),
            )}
          </div>
        </Card>
      </Badge>
      <div className="resource__controls">
        <Button
          className="control__button"
          icon={<EditOutlined />}
          onClick={(event) => {
            event.preventDefault();
            onEdit(resource._id);
          }}
        >
          Éditer
        </Button>
        <Button
          className="control__button"
          type="primary"
          danger
          icon={<CloseOutlined />}
          onClick={(event) => {
            event.preventDefault();
            onDeny(resource._id);
          }}
        >
          Refuser
        </Button>
        <Button
          className="control__button control__button--success"
          icon={<CheckOutlined />}
          onClick={(event) => {
            event.preventDefault();
            onCheck(resource._id);
          }}
        >
          Valider
        </Button>
      </div>
    </div>
  );
};
