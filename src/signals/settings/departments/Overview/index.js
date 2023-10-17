// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { Fragment, useCallback } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import BackLink from 'components/BackLink'
import ListComponent from 'components/List'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import { makeSelectUserCan } from 'containers/App/selectors'
import { makeSelectDepartments } from 'models/departments/selectors'
import { BASE_URL, DEPARTMENT_URL } from 'signals/settings/routes'

import filterData from '../../utils/filterData'

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
  const navigate = useNavigate()

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
        navigate(`${BASE_URL}/${DEPARTMENT_URL}/${itemId}`)
      }
    },
    [navigate, userCan]
  )

  const data = filterData(departments.list, colMap)

  return (
    <Fragment>
      <Row>
        <PageHeader
          dataTestId={'settings-page-header'}
          title={`Afdelingen${
            departments.count ? ` (${departments.count})` : ''
          }`}
          BackLink={<BackLink to={BASE_URL}>Terug naar instellingen</BackLink>}
        />
      </Row>
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
