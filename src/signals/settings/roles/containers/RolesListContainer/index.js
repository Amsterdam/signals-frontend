// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam

import { Row, Column, Button } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import BackLink from 'components/BackLink'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import { makeSelectUserCan } from 'containers/App/selectors'
import { rolesModelSelector } from 'models/roles/selectors'
import { BASE_URL, ROLE_URL } from 'signals/settings/routes'

import RolesList from './components/RolesList'

const HeaderButton = styled(Button)`
  &:hover {
    color: white;
  }
`

export const RolesListContainer = ({
  roles: { list, loading, loadingPermissions },
  userCan,
}) => {
  return (
    <>
      <Row>
        <PageHeader
          title="Rollen"
          BackLink={<BackLink to={BASE_URL}>Terug naar instellingen</BackLink>}
        >
          {userCan('add_group') && (
            <HeaderButton
              variant="primary"
              forwardedAs={Link}
              to={`${BASE_URL}/${ROLE_URL}`}
            >
              Rol toevoegen
            </HeaderButton>
          )}
        </PageHeader>
      </Row>
      <Row>
        <Column span={12}>
          {loading || loadingPermissions ? (
            <LoadingIndicator />
          ) : (
            <RolesList
              list={list}
              linksEnabled={Boolean(userCan('change_group'))}
            />
          )}
        </Column>
      </Row>
    </>
  )
}

RolesListContainer.defaultProps = {
  roles: {
    list: [],
    loading: false,
  },
}

RolesListContainer.propTypes = {
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
  }),
  userCan: PropTypes.func.isRequired,
}

const mapStateToProps = createStructuredSelector({
  roles: rolesModelSelector,
  userCan: makeSelectUserCan,
})

const withConnect = connect(mapStateToProps)

export default withConnect(RolesListContainer)
