import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import PageHeader from 'components/PageHeader';
import {
  makeSelectIncidentsCount,
  makeSelectFilter,
} from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import { makeSelectQuery } from 'models/search/selectors';
import { emptyReverted } from '../../signals/incident-management/containers/IncidentOverviewPage/actions';
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
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false;
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
  filter: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    searchQuery: PropTypes.string,
    options: PropTypes.shape({
      id: PropTypes.string,
      feedback: PropTypes.string,
      incident_date: PropTypes.string,
      address_text: PropTypes.string,
      stadsdeel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      maincategory_slug: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      priority: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      status: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      category_slug: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
    }),
    refresh: PropTypes.bool,
  }),
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

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PageHeaderContainerComponent);
