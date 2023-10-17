// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { useCallback } from 'react'

import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import ListComponent from 'components/List'
import formatRoles from 'signals/settings/roles/services/formatRoles'
import { BASE_URL, ROLE_URL } from 'signals/settings/routes'

const StyledListComponent = styled(ListComponent)`
  th:nth-child(1),
  td:nth-child(1) {
    width: 20%;
  }
`

export const RolesList = ({ linksEnabled, list }) => {
  const navigate = useNavigate()

  const onItemClick = useCallback(
    (e) => {
      if (!linksEnabled) {
        e.preventDefault()
        return
      }

      const roleId = e.currentTarget.getAttribute('data-item-id')
      /* istanbul ignore else */
      if (roleId > -1) {
        navigate(`${BASE_URL}/${ROLE_URL}/${roleId}`)
      }
    },
    [navigate, linksEnabled]
  )

  return (
    <div data-testid="roles-list">
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
