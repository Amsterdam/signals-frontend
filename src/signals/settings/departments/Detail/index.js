import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Column, Heading, Paragraph, themeSpacing } from '@datapunt/asc-ui';

import { makeSelectCategories } from 'containers/App/selectors';
import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import BackLink from 'components/BackLink';
import routes from 'signals/settings/routes';
import CheckboxList from 'signals/incident-management/components/CheckboxList';
import * as types from 'shared/types';
import { ControlsWrapper, Fieldset, FilterGroup, Form } from 'signals/incident-management/components/FilterForm/styled';
import Label from 'components/Label';

import useFetchDepartment from './hooks/useFetchDepartment';

const StyledFieldset = styled(Fieldset)`
  padding-top: ${themeSpacing(2)};

  & > .Label {
    margin-bottom: ${themeSpacing(4)};
  }
`;

const groupSubcategoriesByMainSlug = (departmentCategories, { mainToSub }) =>
  Object.keys(mainToSub).reduce((acc, mainCategory) => {
    const subCategories = mainToSub[mainCategory].map(subcategory => {
      const departmentCategory = departmentCategories.find(
        ({
          category: {
            _links: {
              self: { href },
            },
          },
        }) => href === subcategory.id
      );
      const departmentCatProps = {};

      if (departmentCategory) {
        departmentCatProps.is_responsible = departmentCategory.is_responsible;
        departmentCatProps.can_view = departmentCategory.can_view;
        departmentCatProps.dep_cat_id = departmentCategory.id;
      }

      return { ...{ ...subcategory, ...departmentCatProps } };
    });

    return { ...acc, [mainCategory]: subCategories };
  }, {});

const categoriesWith = (prop, subcategories) =>
  subcategories
    .filter(subcategory => Boolean(subcategory[prop]))
    .map(({ id, name, slug }) => ({ key: id, value: name, slug }));

const DepartmentDetail = ({ categories }) => {
  const { departmentId } = useParams();
  const { isLoading, data, error } = useFetchDepartment(departmentId);
  const isExistingDepartment = departmentId !== undefined;
  const categoriesGrouped =
    data && groupSubcategoriesByMainSlug(data.categories, categories);

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

          <Row>
            <Column span={6}>
              <ControlsWrapper>
                <StyledFieldset>
                  <Label as="span" isGroupHeader>Verantwoordelijk voor categorie</Label>

                  {Object.keys(categoriesGrouped)
                    .sort()
                    .map(mainCategory => {
                      const mainCatObj = categories.main.find(
                        ({ slug }) => slug === mainCategory
                      );
                      const options = categoriesGrouped[mainCategory];

                      return (
                        <CheckboxList
                          clusterName="category_slug"
                          defaultValue={categoriesWith('is_responsible', options)}
                          groupName={mainCategory}
                          groupId={mainCatObj.key}
                          hasToggle
                          key={mainCategory}
                          options={options}
                          title={mainCatObj.value}
                          toggleFieldName="maincategory_slug"
                        />
                      );
                    })}
                </StyledFieldset>
              </ControlsWrapper>
            </Column>

            <Column span={6}>
              <ControlsWrapper>
                <StyledFieldset>
                  <Label as="span" isGroupHeader>Toegang tot categorie</Label>

                  {Object.keys(categoriesGrouped)
                    .sort()
                    .map(mainCategory => {
                      const mainCatObj = categories.main.find(
                        ({ slug }) => slug === mainCategory
                      );
                      const options = categoriesGrouped[mainCategory];

                      return (
                        <CheckboxList
                          clusterName="category_slug"
                          defaultValue={categoriesWith('can_view', options)}
                          groupName={mainCategory}
                          groupId={mainCatObj.key}
                          hasToggle
                          key={mainCategory}
                          options={options}
                          title={mainCatObj.value}
                          toggleFieldName="maincategory_slug"
                        />
                      );
                    })}
                </StyledFieldset>
              </ControlsWrapper>
            </Column>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
};

DepartmentDetail.propTypes = {
  categories: types.categoriesType.isRequired,
};

const mapStateToProps = () =>
  createStructuredSelector({
    categories: makeSelectCategories(),
  });

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(DepartmentDetail);
