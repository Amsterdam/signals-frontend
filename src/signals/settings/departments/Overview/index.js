import React, { Fragment, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Row, Column } from '@datapunt/asc-ui';
import { useHistory } from 'react-router-dom';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import { makeSelectDepartments } from 'models/departments/selectors';
import { makeSelectUserCan } from 'containers/App/selectors';
import { DEPARTMENT_URL } from 'signals/settings/routes';

const StyledList = styled(ListComponent)`
  th:first-child {
    width: 250px;
  }
`;

const DepartmentOverview = () => {
  const departments = useSelector(makeSelectDepartments);
  const userCan = useSelector(makeSelectUserCan);
  const history = useHistory();

  const onItemClick = useCallback(
    e => {
      if (!userCan('change_department')) {
        e.preventDefault();
        return;
      }

      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = e;

      if (itemId) {
        history.push(`${DEPARTMENT_URL}/${itemId}`);
      }
    },
    [history, userCan]
  );

  return (
    <Fragment>
      <PageHeader
        title={`Afdelingen${departments.count ? ` (${departments.count})` : ''}`}
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

export default DepartmentOverview;
