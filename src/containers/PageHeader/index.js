import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import PageHeader from 'components/PageHeader';
import { makeSelectQuery } from 'models/search/selectors';
import { makeSelectActiveFilter } from 'signals/incident-management/containers/Filter/selectors';
import { makeSelectIncidentsCount } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';

export const PageHeaderContainerComponent = ({
  incidentsCount,
  activeFilter: { name },
  query,
}) => {
  let title = name || 'Meldingen';
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false;
  title += hasCount ? ` (${incidentsCount})` : '';

  const subTitle = query && `Zoekresultaten voor "${query}"`;

  return <PageHeader title={title} subTitle={subTitle} />;
};

PageHeaderContainerComponent.propTypes = {
  activeFilter: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  incidentsCount: PropTypes.number,
  query: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  incidentsCount: makeSelectIncidentsCount,
  query: makeSelectQuery,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(PageHeaderContainerComponent);
