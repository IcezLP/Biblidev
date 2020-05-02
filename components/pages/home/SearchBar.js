import React from 'react';
import { Row, Col, Tag, Input, Select } from 'antd';

const { memo } = React;
const { Search } = Input;

const sortOptions = [
  {
    label: 'Ordre alphabétique',
    value: 'ascending',
  },
  {
    label: 'Ordre alphabétique inversé',
    value: 'descending',
  },
  {
    label: 'Note moyenne la plus haute',
    value: 'best',
    disabled: true,
  },
  {
    label: 'Note moyenne la plus basse',
    value: 'worst',
    disabled: true,
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

const SearchBar = ({ selectedOption, onSearch, onSortChange }) => {
  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={14} md={16} lg={18} xxl={20}>
          <Search placeholder="Rechercher..." onSearch={onSearch} />
        </Col>
        <Col xs={24} sm={10} md={8} lg={6} xxl={4}>
          <Select
            options={sortOptions}
            value={selectedOption}
            style={{ width: '100%' }}
            placeholder="Trier par"
            onChange={onSortChange}
          />
        </Col>
      </Row>
    </>
  );
};

export default memo(SearchBar);
