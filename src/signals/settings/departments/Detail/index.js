import React, { Fragment, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Column, Heading, Paragraph } from '@datapunt/asc-ui';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import BackLink from 'components/BackLink';
import routes from 'signals/settings/routes';

import useFetchDepartment from './hooks/useFetchDepartment';
import CategoryLists from './components/CategoryLists';

const DepartmentDetail = () => {
  const { departmentId } = useParams();
  const { isLoading, data } = useFetchDepartment(departmentId);
  const isExistingDepartment = departmentId !== undefined;

  const title = useMemo(
    () => `Afdeling ${isExistingDepartment ? 'wijzigen' : 'toevoegen'}`,
    [isExistingDepartment]
  );

  return (
    <Fragment>
      <PageHeader
        title={title}
        BackLink={
          <BackLink to={routes.departments}>Terug naar overzicht</BackLink>
        }
      />

      {isLoading && <LoadingIndicator />}

      {!isLoading && data && (
        <Fragment>
          <Row>
            <Column span={12}>
              <div>
                <Heading $as="h2" styleAs="h4">
                  Afdeling
                </Heading>
                <Paragraph>{data.name}</Paragraph>
              </div>
            </Column>
          </Row>

          {data && <CategoryLists categoryGroups={data.categories} />}
        </Fragment>
      )}
    </Fragment>
  );
};

export default DepartmentDetail;
