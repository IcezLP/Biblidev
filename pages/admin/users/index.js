import React, { useState } from 'react';
import useSWR from 'swr';
import { Table, Tag, Button, Input, Avatar, Dropdown, Menu, Modal } from 'antd';
import Moment from 'react-moment';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ImportOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Link from 'next/link';
import withAuth from '../../../middlewares/withAuth';
import Layout from '../../../components/layout/admin/Layout';
import fetch from '../../../lib/fetch';
import UserModal from '../../../components/pages/admin/resources/UserModal';
import { notify } from '../../../lib/notification';

export default withAuth(
  () => {
    const [search, setSearch] = useState({ searchText: '', searchedColumn: '' });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const categories = useSWR('/api/categories', (url) => fetch('get', url));

    const handleDelete = async (id, name) => {
      const confirm = Modal.confirm({
        title: `Êtes-vous sûr de vouloir supprimer la ressource « ${name} » ?`,
        okText: 'Confirmer',
        cancelText: 'Annuler',
        onOk: (event) => {
          confirm.update({
            okButtonProps: {
              loading: true,
            },
            cancelButtonProps: {
              disabled: true,
            },
          });

          const acceptResource = async () => {
            const response = await fetch('delete', `/api/admin/resources/${id}`);

            notify(response.status, response.message);

            confirm.update({
              okButtonProps: {
                loading: false,
              },
              cancelButtonProps: {
                disabled: false,
              },
            });
            resources.mutate();
            confirm.destroy();
          };

          acceptResource();
        },
        icon: <QuestionCircleOutlined />,
      });
    };

    const subTitle = () => {
      if (!categories.data) {
        return 'Chargement des ressources...';
      }

      if (categories.data.status === 'error' || !categories.data.data.categories) {
        return '';
      }

      if (categories.data.data.categories.length === 0) {
        return 'Aucune ressource à valider';
      }

      return `${categories.data.data.categories.length} ressource${
        categories.data.data.categories.length > 1 ? 's' : ''
      } chargées`;
    };

    const dataSource = () => {
      if (!categories.data || (categories.data && categories.data.status === 'error')) {
        return [];
      }

      return categories.data.data.categories;
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();

      setSearch({ searchText: selectedKeys[0], searchedColumn: dataIndex });
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      setSearch({ searchText: '', searchedColumn: '' });
    };

    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Rechercher"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ maxWidth: 500, marginBottom: 8, display: 'block' }}
            autoFocus
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            Rechercher
          </Button>
          <Button size="small" style={{ width: 90 }} onClick={() => handleReset(clearFilters)}>
            Réinitialiser
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (text) =>
        search.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[search.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    });

    const onSelectChange = (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      hideDefaultSelections: true,
      columnWidth: 50,
      selections: [
        {
          key: 'delete',
          text: (
            <>
              <DeleteOutlined />
              Supprimer
            </>
          ),
          onSelect: () => console.log('Delete', selectedRowKeys),
        },
      ],
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
        ...getColumnSearchProps('name'),
      },
      {
        title: 'Date de création',
        key: 'createdAt',
        dataIndex: 'createdAt',
        width: 150,
        className: 'center',
        render: (date) => <Moment format="DD/MM/YYYY">{date}</Moment>,
        sorter: (a, b) => {
          a = new Date(a.createdAt);
          b = new Date(b.createdAt);

          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        },
      },
      {
        key: 'action',
        fixed: 'right',
        width: 50,
        className: 'center',
        render: (text, record) => (
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item key="edit" onClick={() => console.log(`Edit ${record.name}`)}>
                  <EditOutlined />
                  Éditer
                </Menu.Item>
                <Menu.Item key="delete" onClick={() => handleDelete(record._id, record.name)}>
                  <DeleteOutlined />
                  Supprimer
                </Menu.Item>
              </Menu>
            }
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        ),
      },
    ];

    return (
      <Layout title="Toutes les ressources validées" subTitle={subTitle()}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/admin/resources/import" as="/admin/ressources/importation">
            <a>
              <Button icon={<ImportOutlined />} style={{ marginRight: 8 }} type="primary">
                Importer
              </Button>
            </a>
          </Link>
          <Link href="/admin/resources/add" as="/admin/ressources/ajout">
            <a>
              <Button icon={<PlusOutlined />} type="primary">
                Ajouter
              </Button>
            </a>
          </Link>
        </div>
        <Table
          dataSource={dataSource()}
          columns={columns}
          size="middle"
          pagination={{ position: ['bottomRight'] }}
          rowKey={(record) => record._id}
          loading={!categories.data}
          locale={{
            cancelSort: 'Annuler le tri',
            triggerAsc: 'Trier par ordre croissant',
            triggerDesc: 'Trier par ordre décroissant',
            emptyText: 'Aucune ressource',
            filterReset: 'Réinitialiser',
          }}
          // rowSelection={rowSelection}
        />
      </Layout>
    );
  },
  {
    loginRequired: true,
    adminRequired: true,
  },
);
