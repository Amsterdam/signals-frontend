import React from 'react';
import PageHeader from 'signals/settings/components/PageHeader';
import BackLink from 'components/BackLink';

const DepartmentDetail = () => (
  <PageHeader
    title="Afdeling"
    BackLink={<BackLink to="/">Terug naar overzicht</BackLink>}
  />
);

export default DepartmentDetail;
