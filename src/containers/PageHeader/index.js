import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import PageHeader from 'components/PageHeader';
import {
  makeSelectIncidentsCount,
  makeSelectFilter,
} from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import { makeSelectQuery } from 'models/search/selectors';

export const PageHeaderContainerComponent = ({ incidentsCount, filter, children, query }) => {
  let title = filter.name || 'Meldingen';
  const hasCount = !!incidentsCount && isNaN(Number(incidentsCount)) === false;
  title += hasCount ? ` (${incidentsCount})` : '';
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
      stadsdeel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      maincategory_slug: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      priority: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      status: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      category_slug: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    }),
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

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(PageHeaderContainerComponent);
