import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import PageHeader from 'components/PageHeader';
import makeSelectSearchModel from 'models/search/selectors';
import { makeSelectActiveFilter } from 'signals/incident-management/containers/Filter/selectors';
import { makeSelectIncidentsCount } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';

export const PageHeaderContainerComponent = ({
  incidentsCount,
  activeFilter: { name },
  searchModel,
}) => {
  let title = name || 'Meldingen';
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false;
  title += hasCount ? ` (${incidentsCount})` : '';

  const subTitle = searchModel && searchModel.query && `Zoekresultaten voor "${searchModel.query}"`;

  return <PageHeader title={title} subTitle={subTitle} />;
};

PageHeaderContainerComponent.propTypes = {
  activeFilter: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  incidentsCount: PropTypes.number,
  searchModel: PropTypes.shape({
    query: PropTypes.string,
  }),
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  incidentsCount: makeSelectIncidentsCount,
  searchModel: makeSelectSearchModel,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(PageHeaderContainerComponent);
