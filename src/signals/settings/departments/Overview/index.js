// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { Fragment, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Row, Column } from '@amsterdam/asc-ui'
import { useHistory } from 'react-router-dom'

import PageHeader from 'signals/settings/components/PageHeader'
import LoadingIndicator from 'components/LoadingIndicator'
import ListComponent from 'components/List'
import { makeSelectDepartments } from 'models/departments/selectors'
import { makeSelectUserCan } from 'containers/App/selectors'
import { DEPARTMENT_URL } from 'signals/settings/routes'

import filterData from '../../filterData'

const StyledList = styled(ListComponent)`
  th {
    font-weight: 400;
  }

  th:first-child {
    width: 250px;
  }
`

const colMap = {
  id: 'id',
  _display: 'Naam',
  category_names: 'Subcategorie',
}

const DepartmentOverview = () => {
  const departments = useSelector(makeSelectDepartments)
  const userCan = useSelector(makeSelectUserCan)
  const history = useHistory()

  const onItemClick = useCallback(
    (event) => {
      if (!userCan('change_department')) {
        event.preventDefault()
        return
      }

      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = event

      if (itemId) {
        history.push(`${DEPARTMENT_URL}/${itemId}`)
      }
    },
    [history, userCan]
  )

  const data = filterData(departments.list, colMap)

  return (
    <Fragment>
      <PageHeader
        title={`Afdelingen${
          departments.count ? ` (${departments.count})` : ''
        }`}
      />

      <Row>
        {departments.loading && <LoadingIndicator />}

        <Column span={12}>
          {!departments.loading && data && (
            <StyledList
              columnOrder={['Naam', 'Subcategorie']}
              items={data}
              onItemClick={onItemClick}
              primaryKeyColumn="id"
            />
          )}
        </Column>
      </Row>
    </Fragment>
  )
}

export default DepartmentOverview
