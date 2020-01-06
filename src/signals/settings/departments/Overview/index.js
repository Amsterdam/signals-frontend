import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Row, Column } from '@datapunt/asc-ui';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import { makeSelectDepartments } from 'models/departments/selectors';

const StyledList = styled(ListComponent)`
  th:first-child {
    width: 250px;
  }
`;

export const DepartmentOverviewContainer = ({ departments }) => (
  <Fragment>
    <PageHeader
      title={`Afdelingen ${departments.count ? `(${departments.count})` : ''}`}
    />

    <Row>
      {departments.loading && <LoadingIndicator />}

      <Column span={12}>
        {!departments.loading && departments.list && (
          <StyledList
            columnOrder={['Naam', 'Categorie']}
            items={departments.list}
            primaryKeyColumn="id"
          />
        )}
      </Column>
    </Row>
  </Fragment>
);

DepartmentOverviewContainer.defaultProps = {
  departments: {},
};

DepartmentOverviewContainer.propTypes = {
  departments: PropTypes.shape({
    loading: PropTypes.bool,
    list: PropTypes.arrayOf(PropTypes.shape({})),
    count: PropTypes.number,
  }),
};

const mapStateToProps = createStructuredSelector({
  departments: makeSelectDepartments,
});

const withConnect = connect(mapStateToProps);

export default withConnect(DepartmentOverviewContainer);
