import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import PageHeader from 'components/PageHeader';
import { makeSelectActiveFilter } from 'models/filter/selectors';
import { makeSelectIncidentsCount } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';

export const PageHeaderContainerComponent = ({
  activeFilter: { name },
  children,
  incidentsCount,
}) => {
  let title = name || 'Meldingen';
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false;
  title += hasCount ? ` (${incidentsCount})` : '';

  return <PageHeader title={title}>{children}</PageHeader>;
};

PageHeaderContainerComponent.defaultProps = {
  children: null,
};

PageHeaderContainerComponent.propTypes = {
  activeFilter: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  children: PropTypes.node,
  incidentsCount: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  incidentsCount: makeSelectIncidentsCount,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(PageHeaderContainerComponent);
