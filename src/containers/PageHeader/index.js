import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

// import injectSaga from 'utils/injectSaga';
import PageHeader from 'components/PageHeader';
import { makeSelectActiveFilter } from 'signals/incident-management/containers/Filter/selectors';
import { makeSelectIncidentsCount } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
// import saga from './saga';

export const PageHeaderComponent = ({
  incidentsCount,
  activeFilter: { name },
}) => {
  let title = name || 'Meldingen';
  title += incidentsCount !== undefined ? ` (${incidentsCount})` : '';

  return <PageHeader title={title} />;
};

PageHeaderComponent.defaultProps = {
  incidentsCount: undefined,
};

PageHeaderComponent.propTypes = {
  activeFilter: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  incidentsCount: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  incidentsCount: makeSelectIncidentsCount,
});

const withConnect = connect(mapStateToProps);
// const withSaga = injectSaga({ key: 'incidentManagementFilter', saga });

export default compose(
  // withSaga,
  withConnect,
)(PageHeaderComponent);
