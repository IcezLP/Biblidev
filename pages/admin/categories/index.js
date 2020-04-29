import React, { useState } from 'react';
import useSWR from 'swr';
import { Table, Button, Input as AntdInput, Dropdown, Menu, Modal, Select, Form } from 'antd';
import Moment from 'react-moment';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import withAuth from '../../../middlewares/withAuth';
import Layout from '../../../components/layout/admin/Layout';
import fetch from '../../../lib/fetch';
import { notify } from '../../../lib/notification';
import useForm from '../../../hooks/useForm';
import Input from '../../../components/form/Input';
import EditModal from '../../../components/pages/admin/categories/EditModal';

export default withAuth(
  () => {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState({ searchText: '', searchedColumn: '' });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const categories = useSWR('/api/admin/categories', (url) => fetch('get', url));

    const { values, errors, handleChange, handleSubmit, isLoading } = useForm(
      () => {
        setVisible(false);
        notify('success', 'La catégorie a été créée');
        categories.mutate();
      },
      'post',
      `/api/admin/categories`,
    );

    const handleDelete = async (id, name) => {
      const confirm = Modal.confirm({
        title: `Êtes-vous sûr de vouloir supprimer la catégorie « ${name} » ?`,
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

          const deleteCategory = async () => {
            const response = await fetch('delete', `/api/admin/categories/${id}`);

            notify(response.status, response.message);

            confirm.update({
              okButtonProps: {
                loading: false,
              },
              cancelButtonProps: {
                disabled: false,
              },
            });
            categories.mutate();
            confirm.destroy();
          };

          deleteCategory();
        },
        icon: <QuestionCircleOutlined />,
      });
    };

    const subTitle = () => {
      if (!categories.data) {
        return 'Chargement des catégories...';
      }

      if (categories.data.status === 'error' || !categories.data.data.categories) {
        return '';
      }

      if (categories.data.data.categories.length === 0) {
        return 'Aucune catégorie trouvée';
      }

      if (categories.data.data.categories.length === 1) {
        return '1 catégorie trouvée';
      }

      return `${categories.data.data.categories.length} catégories chargées`;
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
          <AntdInput
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
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: 200,
      },
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
        title: 'Pluriel',
        dataIndex: 'plural_name',
        key: 'plural_name',
        sorter: (a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        },
        sortDirections: ['ascend', 'descend'],
        ...getColumnSearchProps('plural_name'),
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
                <EditModal record={record} mutate={() => categories.mutate()} />
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
          <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => setVisible(true)}
          >
            Ajouter
          </Button>
          <Modal
            key="add"
            visible={visible}
            onCancel={() => setVisible(false)}
            onOk={handleSubmit}
            okText="Confirmer"
            confirmLoading={isLoading}
            title="Ajouter une catégorie"
          >
            <Form noValidate onFinish={handleSubmit}>
              <Input
                name="name"
                value={values.name || ''}
                onChange={handleChange}
                error={errors.name}
                placeholder="Nom"
                label="Nom"
                disabled={isLoading}
                maxLength={30}
              />
              <Input
                name="plural_name"
                value={values.plural_name || ''}
                onChange={handleChange}
                error={errors.plural_name}
                placeholder="Pluriel (optionnel)"
                label="Pluriel (optionnel)"
                disabled={isLoading}
                maxLength={35}
              />
            </Form>
          </Modal>
          <Select placeholder="Avec la séléction" disabled={selectedRowKeys.length <= 0}>
            <Select.Option>Supprimer</Select.Option>
          </Select>
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
          rowSelection={rowSelection}
        />
      </Layout>
    );
  },
  {
    loginRequired: true,
    adminRequired: true,
  },
);
