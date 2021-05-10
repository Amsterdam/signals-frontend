// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import ListComponent from 'components/List'
import { ROLE_URL } from 'signals/settings/routes'

import formatRoles from 'signals/settings/roles/services/formatRoles'

const StyledListComponent = styled(ListComponent)`
  th:nth-child(1),
  td:nth-child(1) {
    width: 20%;
  }
`

export const RolesList = ({ linksEnabled, list }) => {
  const history = useHistory()

  const onItemClick = useCallback(
    (e) => {
      if (!linksEnabled) {
        e.preventDefault()
        return
      }

      const roleId = e.currentTarget.getAttribute('data-item-id')
      /* istanbul ignore else */
      if (roleId > -1) {
        history.push(`${ROLE_URL}/${roleId}`)
      }
    },
    [history, linksEnabled]
  )

  return (
    <div data-testid="rolesList">
      <StyledListComponent
        items={formatRoles(list)}
        invisibleColumns={['id']}
        primaryKeyColumn="id"
        onItemClick={onItemClick}
      />
    </div>
  )
}

RolesList.defaultProps = {
  linksEnabled: true,
  list: [],
}

RolesList.propTypes = {
  linksEnabled: PropTypes.bool,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
}

export default RolesList
