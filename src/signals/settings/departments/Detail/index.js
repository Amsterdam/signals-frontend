import React, { useEffect, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Column, Heading, Paragraph } from '@datapunt/asc-ui';

import {
  makeSelectStructuredCategories,
  makeSelectByMainCategory,
  makeSelectSubCategories,
} from 'models/categories/selectors';
import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import BackLink from 'components/BackLink';
import routes from 'signals/settings/routes';
import useFetch from 'hooks/useFetch';
import CONFIGURATION from 'shared/services/configuration/configuration';
import * as types from 'shared/types';

import CategoryLists from './components/CategoryLists';

const DepartmentDetail = ({ categories, subCategories, findByMain }) => {
  const { departmentId } = useParams();
  const { isLoading, data, get, patch } = useFetch();

  const isExistingDepartment = departmentId !== undefined;
  const title = `Afdeling ${isExistingDepartment ? 'wijzigen' : 'toevoegen'}`;

  const onSubmit = useCallback(formData => {
    patch(`${CONFIGURATION.DEPARTMENTS_ENDPOINT}${departmentId}`, formData);
  }, [departmentId, patch]);

  useEffect(() => {
    get(`${CONFIGURATION.DEPARTMENTS_ENDPOINT}${departmentId}`);
    // Disabling linter; only need to execute on mount;
    // defining the dependencies will throw the component in an endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

          {data && categories && (
            <CategoryLists
              categories={categories}
              department={data}
              findByMain={findByMain}
              onSubmit={onSubmit}
              subCategories={subCategories}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

DepartmentDetail.propTypes = {
  categories: types.categoriesType,
  findByMain: PropTypes.func,
  subCategories: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = () =>
  createStructuredSelector({
    categories: makeSelectStructuredCategories,
    findByMain: makeSelectByMainCategory,
    subCategories: makeSelectSubCategories,
  });

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(DepartmentDetail);
