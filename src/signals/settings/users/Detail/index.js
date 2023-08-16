// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { Fragment, useCallback, useEffect } from 'react'

import { Row } from '@amsterdam/asc-ui'
import isEqual from 'lodash/isEqual'
import { useSelector } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import BackLink from 'components/BackLink'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import { makeSelectUserCan } from 'containers/App/selectors'
import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import useConfirmedCancel from 'signals/settings/hooks/useConfirmedCancel'
import useFetchResponseNotification from 'signals/settings/hooks/useFetchResponseNotification'
import routes from 'signals/settings/routes'

import UserForm from './components/UserForm'

const FormContainer = styled.div`
  // taking into account the space that the FormFooter component takes up
  padding-bottom: 66px;
`

const UserDetail = () => {
  const entityName = 'Gebruiker'
  const { userId } = useParams()
  const location = useLocation()
  const userCan = useSelector(makeSelectUserCan)

  const isExistingUser = userId !== undefined
  const { isLoading, isSuccess, error, data, get, patch, post, type } =
    useFetch()
  const { get: historyGet, data: historyData } = useFetch()
  const shouldRenderForm = !isExistingUser || (isExistingUser && Boolean(data))
  const redirectURL = location.referrer || routes.users
  const userCanSubmitForm =
    (isExistingUser && userCan('change_user')) ||
    (!isExistingUser && userCan('add_user'))
  const confirmedCancel = useConfirmedCancel(redirectURL)

  useFetchResponseNotification({
    entityName,
    error,
    requestType: type,
    isLoading,
    isSuccess,
    redirectURL,
  })

  useEffect(() => {
    if (userId) {
      get(`${configuration.USERS_ENDPOINT}${userId}`)
      historyGet(`${configuration.USERS_ENDPOINT}${userId}/history`)
    }
  }, [get, historyGet, userId])

  const onSubmit = useCallback(
    (formData) => {
      if (isEqual(data, formData.form)) return

      if (isExistingUser) {
        patch(`${configuration.USERS_ENDPOINT}${userId}`, formData.postPatch)
      } else {
        post(configuration.USERS_ENDPOINT, formData.postPatch)
      }
    },
    [data, isExistingUser, patch, post, userId]
  )

  const onCancel = useCallback(
    (formData) => {
      const isPristine = isEqual(data, formData.form)
      confirmedCancel(isPristine)
    },
    [data, confirmedCancel]
  )

  const title = `${entityName} ${isExistingUser ? 'wijzigen' : 'toevoegen'}`

  return (
    <Fragment>
      <Row>
        <PageHeader
          dataTestId={'settings-page-header'}
          title={title}
          BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>}
        />
      </Row>

      {isLoading && <LoadingIndicator />}

      <FormContainer data-testid="user-detail-form-container">
        {shouldRenderForm && (
          <UserForm
            data={data}
            history={historyData}
            onCancel={onCancel}
            onSubmit={onSubmit}
            readOnly={!userCanSubmitForm}
          />
        )}
      </FormContainer>
    </Fragment>
  )
}

export default UserDetail
