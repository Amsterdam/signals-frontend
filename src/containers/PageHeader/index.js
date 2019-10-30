import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import * as types from 'shared/types';

import PageHeader from 'components/PageHeader';
import { makeSelectIncidentsCount } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import { makeSelectActiveFilter } from 'signals/incident-management/selectors';
import { makeSelectQuery } from 'models/search/selectors';

import Refresh from '../../shared/images/icon-refresh.svg';

const RefreshIcon = styled(Refresh).attrs({
  height: 18,
})`
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
`;

export const PageHeaderContainerComponent = ({
  incidentsCount,
  filter,
  children,
  query,
}) => {
  let title = filter.name || 'Meldingen';
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false; // eslint-disable-line no-restricted-globals
  title += hasCount ? ` (${incidentsCount})` : '';
  title = filter.refresh ? (
    <Fragment>
      <RefreshIcon /> {title}
    </Fragment>
  ) : (
    title
  );
  const subTitle = query && `Zoekresultaten voor "${query}"`;

  return (
    <PageHeader title={title} subTitle={subTitle}>
      {children}
    </PageHeader>
  );
};

PageHeaderContainerComponent.defaultProps = {
  children: null,
};

PageHeaderContainerComponent.propTypes = {
  filter: types.filterType,
  children: PropTypes.node,
  incidentsCount: PropTypes.number,
  query: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  filter: makeSelectActiveFilter,
  incidentsCount: makeSelectIncidentsCount,
  query: makeSelectQuery,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(PageHeaderContainerComponent);
