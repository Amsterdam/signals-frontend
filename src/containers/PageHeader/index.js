import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import PageHeader from 'components/PageHeader';
import { makeSelectIncidentsCount, makeSelectFilter } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import { makeSelectQuery } from 'models/search/selectors';
import { emptyReverted } from '../../signals/incident-management/containers/IncidentOverviewPage/actions';

export const PageHeaderContainerComponent = ({
  incidentsCount,
  filter,
  children,
  query,
}) => {
  let title = filter.name || 'Meldingen';
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false;
  title += hasCount ? ` (${incidentsCount})` : '';
  const subTitle = query && `Zoekresultaten voor "${query}"`;

  return <PageHeader title={title} subTitle={subTitle}>{children}</PageHeader>;
};

PageHeaderContainerComponent.defaultProps = {
  children: null,
};

PageHeaderContainerComponent.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }).isRequired,
  children: PropTypes.node,
  incidentsCount: PropTypes.number,
  query: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  filter: makeSelectFilter,
  incidentsCount: makeSelectIncidentsCount,
  query: makeSelectQuery,
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
