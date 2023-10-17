// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { useEffect, useCallback, Fragment, useMemo } from 'react'

import { Row, Column, Heading, Paragraph } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import BackLink from 'components/BackLink'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import useFetch from 'hooks/useFetch'
import {
  makeSelectStructuredCategories,
  makeSelectByMainCategory,
  makeSelectSubCategories,
} from 'models/categories/selectors'
import CONFIGURATION from 'shared/services/configuration/configuration'
import * as types from 'shared/types'
import routes, { BASE_URL } from 'signals/settings/routes'

import CategoryLists from './components/CategoryLists'
import DepartmentDetailContext from './context'
import useConfirmedCancel from '../../hooks/useConfirmedCancel'
import useFetchResponseNotification from '../../hooks/useFetchResponseNotification'

export const DepartmentDetailContainer = ({
  categories,
  findByMain,
  subCategories,
}) => {
  const { departmentId } = useParams()
  const isExistingDepartment = departmentId !== undefined
  const { isLoading, isSuccess, data, error, get, patch, type } = useFetch()
  const redirectURL = location.referrer || `${BASE_URL}/${routes.departments}`
  const confirmedCancel = useConfirmedCancel(redirectURL)
  const entityName = `Afdeling${data ? ` '${data.name}'` : ''}`
  const title = `${entityName} ${
    isExistingDepartment ? 'wijzigen' : 'toevoegen'
  }`

  useFetchResponseNotification({
    entityName,
    error,
    requestType: type,
    isLoading,
    isSuccess,
    redirectURL: redirectURL,
  })

  const onSubmit = useCallback(
    (formData) => {
      patch(`${CONFIGURATION.DEPARTMENTS_ENDPOINT}${departmentId}`, formData)
    },
    [departmentId, patch]
  )

  useEffect(() => {
    get(`${CONFIGURATION.DEPARTMENTS_ENDPOINT}${departmentId}`)
  }, [get, departmentId])

  const contextValue = useMemo(
    () => ({ categories, department: data, subCategories, findByMain }),
    [categories, data, findByMain, subCategories]
  )

  return (
    <Fragment>
      <Row>
        <PageHeader
          dataTestId={'settings-page-header'}
          title={title}
          BackLink={
            <BackLink to={`${BASE_URL}/${routes.departments}`}>
              Terug naar overzicht
            </BackLink>
          }
        />
      </Row>

      {isLoading && <LoadingIndicator />}

      {!isLoading && data && (
        <Fragment>
          <Row data-testid="department-detail">
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
            <DepartmentDetailContext.Provider value={contextValue}>
              <CategoryLists onCancel={confirmedCancel} onSubmit={onSubmit} />
            </DepartmentDetailContext.Provider>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

DepartmentDetailContainer.propTypes = {
  categories: types.categoriesType,
  findByMain: PropTypes.func,
  subCategories: PropTypes.arrayOf(PropTypes.shape({})),
}
/* istanbul ignore next */
const mapStateToProps = () =>
  createStructuredSelector({
    categories: makeSelectStructuredCategories,
    findByMain: makeSelectByMainCategory,
    subCategories: makeSelectSubCategories,
  })

const withConnect = connect(mapStateToProps)

export default compose(withConnect)(DepartmentDetailContainer)
