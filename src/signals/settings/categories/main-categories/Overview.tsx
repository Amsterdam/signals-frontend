// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Fragment, useCallback } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import BackLink from 'components/BackLink'
import LoadingIndicator from 'components/LoadingIndicator'
import { makeSelectUserCan } from 'containers/App/selectors'
import { makeSelectMainCategories } from 'models/categories/selectors'
import PageHeader from 'signals/settings/components/PageHeader'
import { BASE_URL, MAIN_CATEGORY_URL } from 'signals/settings/routes'

import filterData from '../../utils/filterData'
import { StyledDataView } from '../subcategories/styled'

// name mapping from API values to human readable values
export const colMap = {
  fk: 'fk',
  id: 'id',
  value: 'Hoofdcategorie',
  public_name: 'Openbare Naam',
  // TODO: Add icon
  _links: {
    'sia:icon': 'Icoon',
  },
}

const columnHeaders = ['Hoofdcategorie', 'Openbare Naam', 'Icoon']

export const CategoriesOverview = () => {
  const history = useHistory()
  const mainCategories = useSelector(makeSelectMainCategories)
  const userCan = useSelector(makeSelectUserCan)

  const isLoading = !mainCategories

  const data = filterData(mainCategories || [], colMap)

  const onItemClick = useCallback(
    (e) => {
      if (!userCan('change_category')) {
        e.preventDefault()
        return
      }

      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = e

      if (itemId) {
        history.push(`${MAIN_CATEGORY_URL}/${itemId}`)
      }
    },
    [history, userCan]
  )

  return (
    <Fragment>
      <PageHeader
        title={`Hoofdcategorieën ${
          mainCategories ? `(${mainCategories.length})` : ''
        }`}
        BackLink={<BackLink to={BASE_URL}>Terug naar instellingen</BackLink>}
      />

      <Row>
        {isLoading && <LoadingIndicator />}

        <Column span={12} wrap>
          <Column span={12}>
            <StyledDataView
              headers={columnHeaders}
              columnOrder={columnHeaders}
              onItemClick={onItemClick}
              primaryKeyColumn="fk"
              data={data}
            />
          </Column>
        </Column>
      </Row>
    </Fragment>
  )
}

export default CategoriesOverview
