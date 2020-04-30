import React from 'react';
import { Row, Col, Tag, Tabs } from 'antd';
import Input from '../../form/Input';
import Select from '../../form/Select';

const sortByOptions = [
  {
    label: 'Ordre alphabétique',
    value: 'ascending',
  },
  {
    label: 'Ordre alphabétique inversé',
    value: 'descending',
  },
  {
    label: 'Plus récents en premier',
    value: 'newest',
  },
  {
    label: 'Plus anciens en premier',
    value: 'oldest',
  },
];

export default ({ search, onChange, sort, onSort, categories, onRemoveFilters }) => {
  const CategoriesLength = () => {
    if (categories.length === 1) {
      return (
        <Row style={{ marginBottom: 10 }}>
          <Tag closable onClose={onRemoveFilters}>
            1 catégorie séléctionnée
          </Tag>
        </Row>
      );
    }

    if (categories.length >= 2) {
      return (
        <Row style={{ marginBottom: 10 }}>
          <Tag closable onClose={onRemoveFilters}>
            {/* eslint-disable-next-line */}
            {categories.length} catégories séléctionnées
          </Tag>
        </Row>
      );
    }

    return '';
  };

  return (
    <>
      <Row gutter={[12, 12]} type="flex">
        <Col xs={24} sm={14} md={16} lg={18} xxl={20}>
          <Input
            name="search"
            search
            value={search}
            onChange={onChange}
            placeholder="Rechercher..."
            enterButton={false}
          />
        </Col>
        <Col xs={24} sm={10} md={8} lg={6} xxl={4}>
          <Select
            options={sortByOptions}
            optionLabel="label"
            optionKey="value"
            value={sort}
            name="order"
            onChange={onSort}
            allowClear={false}
            showSearch={false}
          />
        </Col>
      </Row>
      <CategoriesLength />
    </>
  );
};
