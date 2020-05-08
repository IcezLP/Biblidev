import React, { useState } from 'react';
import { Drawer, Button, Layout, Menu, Affix } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import CustomScroll from 'react-custom-scroll';
import { MediaContextProvider, Media } from '../../../lib/media';

const { Sider } = Layout;
const { ItemGroup, Item } = Menu;
const { memo } = React;

// Menu de séléction du mode de tri des catégories
const CategoriesMode = ({ selectedMode, onModeChange }) => (
  <Menu mode="inline" theme="light" selectedKeys={[selectedMode]}>
    <ItemGroup title="Mode de tri des catégories">
      <Item key="in" onClick={onModeChange}>
        Contient au moins 1 séléction
      </Item>
      <Item key="all" onClick={onModeChange}>
        Contient toute la séléction
      </Item>
    </ItemGroup>
  </Menu>
);

// Menu de séléction des catégories
const Categories = ({ categories, selectedCategories, onCategoriesChange }) => (
  <Menu mode="inline" theme="light" multiple selectedKeys={selectedCategories}>
    <ItemGroup title="Catégories">
      {categories.map((category) => (
        <Item key={category._id} onClick={() => onCategoriesChange(category._id)}>
          {category.plural_name}
        </Item>
      ))}
    </ItemGroup>
  </Menu>
);

const Sidebar = ({
  categories,
  selectedCategories,
  onCategoriesChange,
  selectedMode,
  onModeChange,
}) => {
  // Visibilité du menu mobile & tablette
  const [visible, setVisible] = useState(false);
  // Largeur des menus
  const menuWidth = 230;

  CategoriesMode.defaultProps = {
    selectedMode,
    onModeChange,
  };

  Categories.defaultProps = {
    // Tri les catégories par ordre alphabétique (ignore les accents)
    categories: categories.sort((a, b) =>
      a.plural_name.toLowerCase().localeCompare(b.plural_name.toLowerCase(), 'fr'),
    ),
    selectedCategories,
    onCategoriesChange,
  };

  return (
    <MediaContextProvider>
      {/* Sidebar desktop */}
      <Media greaterThanOrEqual="lg">
        <Affix offsetTop={0}>
          <Sider className="home-sider" width={menuWidth} theme="light">
            <CategoriesMode />
            <Categories />
          </Sider>
        </Affix>
      </Media>
      {/* Sidebar mobile & tablette */}
      <Media lessThan="lg">
        {/* Si la sidebar mobile & tablette est visible on cache le bouton */}
        {!visible && (
          <Button
            className="drawer-handle"
            onClick={() => setVisible(true)}
            icon={<FilterOutlined />}
          />
        )}
        <Drawer
          placement="left"
          className="home-drawer"
          visible={visible}
          closable
          width={menuWidth}
          onClose={() => setVisible(false)}
          bodyStyle={{ padding: 0 }}
        >
          <CustomScroll heightRelativeToParent="100%">
            <CategoriesMode />
            <Categories />
          </CustomScroll>
        </Drawer>
      </Media>
    </MediaContextProvider>
  );
};

export default memo(Sidebar);
