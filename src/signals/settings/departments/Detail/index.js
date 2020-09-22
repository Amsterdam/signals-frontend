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
import LoadingIndicator from 'components/LoadingIndicator';
import BackLink from 'components/BackLink';
import routes from 'signals/settings/routes';
import useFetch from 'hooks/useFetch';
import CONFIGURATION from 'shared/services/configuration/configuration';
import * as types from 'shared/types';

import useConfirmedCancel from '../../hooks/useConfirmedCancel';
import useFetchResponseNotification from '../../hooks/useFetchResponseNotification';
import CategoryLists from './components/CategoryLists';

import DepartmentDetailContext from './context';

export const DepartmentDetailContainer = ({ categories, findByMain, subCategories }) => {
  const { departmentId } = useParams();
  const isExistingDepartment = departmentId !== undefined;
  const { isLoading, isSuccess, data, error, get, patch } = useFetch();
  const confirmedCancel = useConfirmedCancel(routes.departments);
  const entityName = `Afdeling${data ? ` '${data.name}'` : ''}`;
  const title = `${entityName} ${isExistingDepartment ? 'wijzigen' : 'toevoegen'}`;

  useFetchResponseNotification({
    entityName,
    error,
    isExisting: isExistingDepartment,
    isLoading,
    isSuccess,
    redirectURL: routes.departments,
  });

  const onSubmit = useCallback(
    formData => {
      patch(`${CONFIGURATION.DEPARTMENTS_ENDPOINT}${departmentId}`, formData);
    },
    [departmentId, patch]
  );

  useEffect(() => {
    get(`${CONFIGURATION.DEPARTMENTS_ENDPOINT}${departmentId}`);
  }, [get, departmentId]);

  return (
    <Fragment>
      <PageHeader title={title} BackLink={<BackLink to={routes.departments}>Terug naar overzicht</BackLink>} />

      {isLoading && <LoadingIndicator />}

      {!isLoading && data && (
        <Fragment>
          <Row data-testid="departmentDetail">
            <Column span={12}>
              <div>
                <Heading forwardedAs="h2" styleAs="h4">
                  Afdeling
                </Heading>
                <Paragraph>{data.name}</Paragraph>
              </div>
            </Column>
          </Row>

          {categories && (
            <DepartmentDetailContext.Provider value={{ categories, department: data, subCategories, findByMain }}>
              <CategoryLists onCancel={confirmedCancel} onSubmit={onSubmit} />
            </DepartmentDetailContext.Provider>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

DepartmentDetailContainer.propTypes = {
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

export default compose(withConnect)(DepartmentDetailContainer);
