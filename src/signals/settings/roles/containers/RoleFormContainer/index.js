// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { Fragment, useEffect } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'

import BackLink from 'components/BackLink'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import { showGlobalNotification as showGlobalNotificationAction } from 'containers/App/actions'
import { makeSelectUserCan } from 'containers/App/selectors'
import { VARIANT_SUCCESS, TYPE_LOCAL } from 'containers/Notification/constants'
import { patchRole, saveRole, resetResponse } from 'models/roles/actions'
import { rolesModelSelector } from 'models/roles/selectors'
import routes, { BASE_URL } from 'signals/settings/routes'

import RoleForm from './components/RoleForm'

export const RoleFormContainer = ({
  roles: {
    list,
    permissions,
    loading,
    loadingPermissions,
    responseSuccess,
    responseError,
  },
  onPatchRole,
  onSaveRole,
  showGlobalNotification,
  onResetResponse,
  userCan,
}) => {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const role = list.find((item) => item.id === roleId * 1)
  const title = `Rol ${roleId ? 'wijzigen' : 'toevoegen'}`
  const redirectURL = location.referrer || `${BASE_URL}/${routes.roles}`
  useEffect(() => {
    let message

    if (responseSuccess) {
      message = roleId ? 'Gegevens opgeslagen' : 'Rol toegevoegd'
    }

    onResetResponse()

    if (!message) return

    showGlobalNotification({
      variant: VARIANT_SUCCESS,
      title: message,
      type: TYPE_LOCAL,
    })

    navigate(redirectURL)
  }, [
    navigate,
    onResetResponse,
    redirectURL,
    responseError,
    responseSuccess,
    roleId,
    showGlobalNotification,
  ])

  return (
    <Fragment>
      <Row>
        <PageHeader
          dataTestId={'settings-page-header'}
          title={title}
          BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>}
        />
      </Row>
      <Row>
        <Column span={12}>
          {loading || loadingPermissions ? (
            <LoadingIndicator />
          ) : (
            <RoleForm
              role={role}
              permissions={permissions}
              onPatchRole={onPatchRole}
              onSaveRole={onSaveRole}
              readOnly={!userCan('change_group')}
            />
          )}
        </Column>
      </Row>
    </Fragment>
  )
}

RoleFormContainer.defaultProps = {
  roles: {
    list: [],
    loading: false,
  },
}

RoleFormContainer.propTypes = {
  roles: PropTypes.shape({
    list: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    loading: PropTypes.bool,
    loadingPermissions: PropTypes.bool,
    responseSuccess: PropTypes.bool,
    responseError: PropTypes.bool,
  }),
  showGlobalNotification: PropTypes.func.isRequired,
  onPatchRole: PropTypes.func.isRequired,
  onSaveRole: PropTypes.func.isRequired,
  onResetResponse: PropTypes.func.isRequired,
  userCan: PropTypes.func.isRequired,
}

const mapStateToProps = createStructuredSelector({
  roles: rolesModelSelector,
  userCan: makeSelectUserCan,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showGlobalNotification: showGlobalNotificationAction,
      onResetResponse: resetResponse,
      onPatchRole: patchRole,
      onSaveRole: saveRole,
    },
    dispatch
  )

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default withConnect(RoleFormContainer)
