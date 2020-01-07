import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import * as types from 'shared/types';

import PageHeader from 'components/PageHeader';
import {
  makeSelectActiveFilter,
  makeSelectIncidents,
  makeSelectSearchQuery,
} from 'signals/incident-management/selectors';

import Refresh from '../../shared/images/icon-refresh.svg';

const RefreshIcon = styled(Refresh).attrs({
  height: 18,
})`
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
`;

export const PageHeaderContainerComponent = ({
  children,
  filter,
  incidents,
  query,
}) => {
  const headerTitle = useMemo(() => {
    let title = filter.name || 'Meldingen';
    const hasCount =
      !!incidents.count && isNaN(Number(incidents.count)) === false; // eslint-disable-line no-restricted-globals
    title += hasCount ? ` (${incidents.count})` : '';

    return filter.refresh ? (
      <Fragment>
        <RefreshIcon /> {title}
      </Fragment>
    ) : (
      title
    );
  }, [filter, incidents.count]);

  const subTitle = useMemo(() => query && `Zoekresultaten voor "${query}"`, [
    query,
  ]);

  return (
    <PageHeader title={headerTitle} subTitle={subTitle}>
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
  incidents: PropTypes.shape({
    count: PropTypes.number,
  }),
  query: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  filter: makeSelectActiveFilter,
  incidents: makeSelectIncidents,
  query: makeSelectSearchQuery,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(PageHeaderContainerComponent);
