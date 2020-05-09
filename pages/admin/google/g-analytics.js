import React, { useState } from 'react';
import { Row, Col, Select, DatePicker } from 'antd';
import fr from 'antd/lib/date-picker/locale/fr_FR';
import moment from 'moment';
import withAuth from '../../../middlewares/withAuth';
import Layout from '../../../components/layout/admin/Layout';
import LineChart from '../../../components/pages/admin/google/analytics/LineChart';
import PageViews from '../../../components/pages/admin/google/analytics/PageViews';
import Devices from '../../../components/pages/admin/google/analytics/Devices';
import Actions from '../../../components/pages/admin/google/analytics/Actions';
import Events from '../../../components/pages/admin/google/analytics/Events';

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [dates, setDates] = useState({
    start: '7daysAgo', // Récupère les données des 7 derniers jours par défaut
    end: moment().format('YYYY-MM-DD'), // Récupère la date et la converti au format YYYY-MM-DD (2020-01-13)
    custom: false, // Cache le menu de séléction de dates
  });

  const onSelectChange = (value) => {
    if (value === 'custom') {
      return setDates((current) => ({ ...current, custom: true }));
    }

    return setDates({ start: value, end: moment().format('YYYY-MM-DD'), custom: false });
  };

  const onCustomDatesChange = (date, dateStrings) => {
    const start = dateStrings[0];
    const end = dateStrings[1];

    return setDates({
      start: start || dates.start,
      end: end || dates.end,
      custom: true,
    });
  };

  const value = () => {
    const start = moment(dates.start, 'YYYY-MM-DD', true).isValid() ? moment(dates.start) : '';
    const end = moment(dates.end, 'YYYY-MM-DD', true).isValid() ? moment(dates.end) : '';

    return [start, end];
  };

  const largeDates = () => {
    if (moment(dates.start, 'YYYY-MM-DD', true).isValid()) {
      const diff = moment(dates.end).diff(moment(dates.start), 'days') + 1;
      if (diff >= 15) {
        return true;
      }
    }

    if (dates.start === '30daysAgo') {
      return true;
    }

    return false;
  };

  return (
    <Layout title="Google Analytics" subTitle="Données d'analyse en provenance de Google Analytics">
      <Row gutter={[12, 12]} justify="end">
        <Col xs={24} sm={12} md={12} lg={7} xl={6} xxl={4}>
          <Select defaultValue={dates.start} onChange={onSelectChange} style={{ width: '100%' }}>
            <Select.Option value="7daysAgo">7 derniers jours</Select.Option>
            <Select.Option value="30daysAgo">30 derniers jours</Select.Option>
            <Select.Option value="custom">Dates personnalisées</Select.Option>
          </Select>
        </Col>
      </Row>
      {dates.custom ? (
        <Row gutter={[12, 12]} justify="end">
          <Col xs={24} sm={12} md={12} lg={7} xl={6} xxl={4}>
            <RangePicker
              allowClear
              style={{ width: '100%' }}
              allowEmpty
              onCalendarChange={onCustomDatesChange}
              locale={fr}
              value={value()}
            />
          </Col>
        </Row>
      ) : null}
      <Row gutter={[12, 12]}>
        <Col xs={24} md={largeDates() ? 24 : 12} xxl={12}>
          <LineChart title="Utilisateurs" metrics="users" start={dates.start} end={dates.end} />
        </Col>
        <Col xs={24} md={largeDates() ? 24 : 12} xxl={12}>
          <LineChart title="Sessions" metrics="sessions" start={dates.start} end={dates.end} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={largeDates() ? 12 : 6}>
          <Actions start={dates.start} end={dates.end} />
        </Col>
        <Col xs={24} sm={12} md={16} lg={16} xl={largeDates() ? 12 : 6}>
          <Devices start={dates.start} end={dates.end} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={largeDates() ? 24 : 12}>
          <Events start={dates.start} end={dates.end} />
        </Col>
        <Col xs={24}>
          <PageViews start={dates.start} end={dates.end} />
        </Col>
      </Row>
    </Layout>
  );
};

export default withAuth(Dashboard, { loginRequired: true, adminRequired: true });
