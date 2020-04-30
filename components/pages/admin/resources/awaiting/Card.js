import React from 'react';
import { Card, Typography, Avatar, Tag, Button, Badge } from 'antd';
import { CheckOutlined, DollarOutlined, EditOutlined } from '@ant-design/icons';
import Moment from 'react-moment';
import 'moment/locale/fr';
import UserModal from '../UserModal';
import DenyModal from './DenyModal';
import EditModal from '../EditModal';

export default ({ resource, onCheck, mutate, categories }) => {
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
          <UserModal username={resource.author.username} id={resource.author._id} />
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
        <EditModal
          resource={resource}
          mutate={mutate}
          categories={categories}
          trigger={
            <Button className="control__button" icon={<EditOutlined />}>
              Éditer
            </Button>
          }
        />
        <DenyModal name={resource.name} id={resource._id} mutate={mutate} />
        <Button
          className="control__button control__button--success"
          icon={<CheckOutlined />}
          onClick={(event) => {
            event.preventDefault();
            onCheck(resource.name, resource._id);
          }}
        >
          Valider
        </Button>
      </div>
    </div>
  );
};
