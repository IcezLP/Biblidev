import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Typography, Rate, Button, Skeleton } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor';
import { notify } from '../../../lib/notification';
import fetch from '../../../lib/fetch';

const { memo } = React;
const { Meta } = Card;
const { CheckableTag } = Tag;
const { Text } = Typography;

const ResourceCard = ({ record, selectedCategories, onCategoriesChange, searchQuery, user }) => {
  const [resource, setResource] = useState(record);
  const [favorite, setFavorite] = useState(user && user.favorites.includes(resource._id));
  const [average, setAverage] = useState();
  const site_url = process.env.SITE_URL.split('://').pop();

  useEffect(() => {
    // Calcul le total des notes
    const sum = resource.rates.reduce((acc, c) => acc + c.rate, 0);
    // Calcul la moyenne des notes
    const avg = sum / resource.rates.length || 0;

    setAverage(avg);
  }, [resource.rates]);

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

    setResource((previous) => ({
      ...previous,
      rates: response.data.update,
    }));
  };

  const HasRated = () => {
    if (user && resource.rates.some((item) => item.user.toString() === user._id.toString())) {
      // Récupère l'index de la note de l'utilisateur
      const index = resource.rates.map((item) => item.user).indexOf(user._id);

      return (
        <Text disabled style={{ fontSize: 12 }}>
          {/* eslint-disable-next-line */}
          Vous avez noté {resource.rates[index].rate}/5
        </Text>
      );
    }

    return null;
  };

  return (
    <VisibilitySensor partialVisibility>
      {({ isVisible }) =>
        isVisible ? (
          <Card hoverable className="resource">
            <a href={`${resource.link}?ref=${site_url}`} target="_blank" rel="noopener noreferrer">
              <Meta
                className="resource-meta"
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
                    {searchQuery ? (
                      <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchQuery]}
                        autoEscape
                        textToHighlight={resource.name.toString()}
                      />
                    ) : (
                      resource.name
                    )}
                    <br />
                    <Text type="secondary" className="resource-author">
                      Posté par&nbsp;
                      {resource.author ? (
                        <span className="author-username">{resource.author.username}</span>
                      ) : (
                        'Anonyme'
                      )}
                    </Text>
                  </>
                }
                description={
                  searchQuery ? (
                    <Highlighter
                      highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                      searchWords={[searchQuery]}
                      autoEscape
                      textToHighlight={resource.description.toString()}
                    />
                  ) : (
                    resource.description
                  )
                }
              />
            </a>
            <div className="resource-categories">
              {resource.categories.map(
                (category) =>
                  !(typeof category === 'string') && (
                    <CheckableTag
                      key={category._id}
                      className="resource-category"
                      style={{ cursor: 'pointer' }}
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => onCategoriesChange(category._id)}
                    >
                      {category.name}
                    </CheckableTag>
                  ),
              )}
            </div>
            <div style={{ marginTop: 10 }}>
              <Rate
                allowClear={false}
                allowHalf={false}
                onChange={handleRate}
                value={average}
                style={{
                  color:
                    user &&
                    resource.rates.some((item) => item.user.toString() === user._id.toString())
                      ? '#1890ff'
                      : null,
                }}
              />
              {/* eslint-disable-next-line */}
              <span className="ant-rate-text">({resource.rates.length})</span>
            </div>
            <HasRated />
            <Button
              className={classnames('resource-favorite', { favorite })}
              shape="circle-outline"
              type="link"
              onClick={handleFavorite}
              icon={favorite ? <HeartFilled /> : <HeartOutlined />}
              size="large"
            />
          </Card>
        ) : (
          <Card>
            <Skeleton avatar paragraph={{ rows: 4 }} />
          </Card>
        )
      }
    </VisibilitySensor>
  );
};

ResourceCard.propTypes = {
  record: PropTypes.shape({
    logo: PropTypes.string,
    link: PropTypes.string.isRequired,
    rates: PropTypes.array,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCategoriesChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    favorites: PropTypes.array,
    username: PropTypes.string,
  }),
};

ResourceCard.defaultProps = {
  user: null,
};

export default memo(ResourceCard);
