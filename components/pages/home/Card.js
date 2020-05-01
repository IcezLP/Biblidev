import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Typography, Rate, Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import classnames from 'classnames';
import Highlighter from 'react-highlight-words';
import fetch from '../../../lib/fetch';
import { notify } from '../../../lib/notification';

export default ({ resource, user, handleFilter, filters, search, mutate }) => {
  const [favorite, setFavorite] = useState(user && user.favorites.includes(resource._id));
  const [average, setAverage] = useState();

  const site_url = process.env.SITE_URL.split('://').pop();

  useEffect(() => {
    // Calcul le total des notes
    const sum = resource.rates.reduce((acc, c) => acc + c.rate, 0);
    // Calcul la moyenne des notes
    const avg = sum / resource.rates.length || 0;

    setAverage(avg);
  }, [resource]);

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

  const handleRate = async (value) => {
    if (!user) {
      return notify('info', 'Vous devez être connecté pour effectuer cette action');
    }

    const response = await fetch('put', `/api/resources/rate/${user._id}/${resource._id}`, {
      value,
    });

    if (response.status === 'error') {
      return notify('error', response.message);
    }

    mutate();
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
              {search ? (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={[search]}
                  autoEscape
                  textToHighlight={resource.name.toString()}
                />
              ) : (
                resource.name
              )}
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
          description={
            search ? (
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[search]}
                autoEscape
                textToHighlight={resource.description.toString()}
              />
            ) : (
              resource.description
            )
          }
        />
      </a>
      <div className="resource_categories">
        {resource.categories.map(
          (category) =>
            !(typeof category === 'string') && (
              <Tag.CheckableTag
                key={category._id}
                className="resource__category"
                style={{ cursor: 'pointer' }}
                checked={filters.categories.includes(category._id)}
                onChange={() => handleFilter({ key: category._id })}
              >
                {category.name}
              </Tag.CheckableTag>
            ),
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        <Rate allowClear allowHalf onChange={handleRate} disabled={!user} value={average} />
        <span className="ant-rate-text">({resource.rates.length})</span>
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
