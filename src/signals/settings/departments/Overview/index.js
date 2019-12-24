import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import { makeSelectDepartments } from 'models/departments/selectors';
import { DEPARTMENT_URL } from 'signals/settings/routes';

const StyledList = styled(ListComponent)`
  th:first-child {
    width: 250px;
  }
`;

export const DepartmentOverviewContainer = ({ departments }) => {
  const history = useHistory();

  const onItemClick = useCallback(
    e => {
      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = e;

      if (itemId) {
        history.push(`${DEPARTMENT_URL}/${itemId}`);
      }
    },
    [history]
  );

  return (
    <Fragment>
      <PageHeader
        title={`Afdelingen ${
          departments.count ? `(${departments.count})` : ''
        }`}
      />

      <Row>
        {departments.loading && <LoadingIndicator />}

        <Column span={12}>
          {!departments.loading && departments.list && (
            <StyledList
              columnOrder={['Naam', 'Categorie']}
              items={departments.list}
              onItemClick={onItemClick}
              primaryKeyColumn="id"
            />
          )}
        </Column>
      </Row>
    </Fragment>
  );
};

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
