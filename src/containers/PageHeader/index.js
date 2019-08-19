import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import PageHeader from 'components/PageHeader';
import { makeSelectIncidentsCount, makeSelectFilter } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';

export const PageHeaderContainerComponent = ({
  incidentsCount,
  filter,
}) => {
  let title = filter.name || 'Meldingen';
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false;
  title += hasCount ? ` (${incidentsCount})` : '';

  return <PageHeader title={title} filter={filter} />;
};

PageHeaderContainerComponent.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }).isRequired,
  incidentsCount: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  filter: makeSelectFilter,
  incidentsCount: makeSelectIncidentsCount,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(PageHeaderContainerComponent);
