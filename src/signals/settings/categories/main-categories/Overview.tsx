// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Fragment } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'

import LoadingIndicator from 'components/LoadingIndicator'
import { makeSelectMainCategories } from 'models/categories/selectors'
import PageHeader from 'signals/settings/components/PageHeader'

import filterData from '../../filterData'
import { StyledDataView } from '../subcategories/styled'

// name mapping from API values to human readable values
export const colMap = {
  fk: 'fk',
  id: 'id',
  value: 'Hoofdcategorie',
  public_name: 'Openbare Naam',
  // TODO: Add icon
  icon: 'Icoon',
}

const columnHeaders = ['Hoofdcategorie', 'Openbare Naam', 'Icoon']

export const MainCategoriesOverview = () => {
  const mainCategories = useSelector(makeSelectMainCategories)
  const isLoading = !mainCategories

  const data = filterData(mainCategories || [], colMap)

  const onItemClick = () => {
    // TODO: go to detail page
  }

  return (
    <Fragment>
      <PageHeader
        title={`Hoofdcategorieën ${
          mainCategories ? `(${mainCategories.length})` : ''
        }`}
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
