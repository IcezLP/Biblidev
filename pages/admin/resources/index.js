import React from 'react';
import useSWR from 'swr';
import { Table, Tag } from 'antd';
import Moment from 'react-moment';
import withAuth from '../../../middlewares/withAuth';
import Layout from '../../../components/layout/admin/Layout';
import fetch from '../../../lib/fetch';
import UserModal from '../../../components/pages/admin/resources/UserModal';

export default withAuth(
  () => {
    const resources = useSWR('/api/admin/resources?sort=none', (url) => fetch('get', url));
    const categories = useSWR('/api/categories', (url) => fetch('get', url));

    const subTitle = () => {
      if (!resources.data) {
        return 'Chargement des ressources...';
      }

      if (resources.data.status === 'error' || !resources.data.data.resources) {
        return '';
      }

      if (resources.data.data.resources.length === 0) {
        return 'Aucune ressource à valider';
      }

      return `${resources.data.data.resources.length} ressource${
        resources.data.data.resources.length > 1 ? 's' : ''
      } chargées`;
    };

    const dataSource = () => {
      if (!resources.data || (resources.data && resources.data.status === 'error')) {
        return [];
      }

      return resources.data.data.resources;
    };

    const columns = [
      {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Auteur',
        key: 'author',
        dataIndex: 'author',
        render: (author) => (
          <span>
            {author ? <UserModal username={author.username} id={author._id} /> : 'Anonyme'}
          </span>
        ),
        sorter: (a, b) => {
          a = a.author ? a.author.username : 'Anonyme';
          b = b.author ? b.author.username : 'Anonyme';

          if (a.toLowerCase() < b.toLowerCase()) return -1;
          if (a.toLowerCase() > b.toLowerCase()) return 1;
          return 0;
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Catégorie(s)',
        key: 'categories',
        dataIndex: 'categories',
        render: (categories) => (
          <span>
            {categories.map((category) => (
              <Tag key={category._id}>{category.name}</Tag>
            ))}
          </span>
        ),
        filters:
          categories.data &&
          categories.data.data.categories.map((category) => ({
            text: category.name,
            value: category._id,
          })),
        onFilter: (value, record) =>
          record.categories.some((category) => category._id.toString() === value),
      },
      {
        title: 'Date de création',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (date) => <Moment format="DD/MM/YYYY">{date}</Moment>,
        sorter: (a, b) => {
          a = new Date(a.createdAt);
          b = new Date(b.createdAt);

          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        },
      },
    ];

    return (
      <Layout title="Toutes les ressources validées" subTitle={subTitle()}>
        <Table
          dataSource={dataSource()}
          columns={columns}
          size="middle"
          pagination={{ position: ['bottomRight'] }}
          rowKey={(record) => record._id}
          loading={!resources.data}
          locale={{
            cancelSort: 'Annuler le tri',
            triggerAsc: 'Trier par ordre croissant',
            triggerDesc: 'Trier par ordre décroissant',
            emptyText: 'Aucune ressource',
            filterReset: 'Réinitialiser',
          }}
          expandable={{ expandedRowRender: (record) => <p>{record.description}</p> }}
        />
      </Layout>
    );
  },
  {
    loginRequired: true,
    adminRequired: true,
  },
);
