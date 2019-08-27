import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import PageHeader from 'components/PageHeader';
import { makeSelectIncidentsCount, makeSelectFilter } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import { emptyReverted } from '../../signals/incident-management/containers/IncidentOverviewPage/actions';

export const PageHeaderContainerComponent = ({
  incidentsCount,
  filter,
  onClose,
}) => {
  let title = filter.name || 'Meldingen';
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false;
  title += hasCount ? ` (${incidentsCount})` : '';

  return <PageHeader title={title} filter={filter} onClose={onClose} />;
};

PageHeaderContainerComponent.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }).isRequired,
  incidentsCount: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  filter: makeSelectFilter,
  incidentsCount: makeSelectIncidentsCount,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onClose: emptyReverted,
    },
    dispatch,
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(PageHeaderContainerComponent);
