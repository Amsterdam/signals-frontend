// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { Fragment, useCallback, useEffect, useState } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

import BackLink from 'components/BackLink'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import { PAGE_SIZE } from 'containers/App/constants'
import { makeSelectUserCan } from 'containers/App/selectors'
import { makeSelectAllSubCategories } from 'models/categories/selectors'
import {
  BASE_URL,
  SUBCATEGORY_URL,
  SUBCATEGORIES_PAGED_URL,
} from 'signals/settings/routes'

import { StyledDataView, StyledCompactPager } from './styled'
import filterData from '../../utils/filterData'

// name mapping from API values to human readable values
export const colMap = {
  fk: 'fk',
  id: 'id',
  value: 'Subcategorie',
  is_active: 'Status',
  sla: 'Afhandeltermijn',
}

const columnHeaders = ['Subcategorie', 'Afhandeltermijn', 'Status']

interface Params {
  pageNum: string
  [key: string]: string | undefined
}

export const OverviewContainer = () => {
  const navigate = useNavigate()
  const params = useParams<Params>()

  const [page, setPage] = useState(1)
  const subCategories = useSelector(makeSelectAllSubCategories)
  const userCan = useSelector(makeSelectUserCan)

  const pageNum = Number.parseInt(params.pageNum || '1', 10)
  const count = subCategories?.length || 0
  const sliceStart = (pageNum - 1) * PAGE_SIZE
  const pagedData = (subCategories || [])
    .slice(sliceStart, sliceStart + PAGE_SIZE)
    .map((category) => ({
      ...category,
      sla: `${category.sla.n_days} ${
        !category.sla.use_calendar_days ? 'werk' : ''
      }dagen`,
    }))
  const data = filterData(pagedData, colMap)
  const isLoading = !subCategories

  useEffect(() => {
    if (pageNum && pageNum !== page) {
      setPage(pageNum)
    }
  }, [page, pageNum])

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
        navigate(`${SUBCATEGORY_URL}/${itemId}`)
      }
    },
    [navigate, userCan]
  )

  const onPaginationClick = useCallback(
    (pageToNavigateTo) => {
      global.window.scrollTo(0, 0)
      navigate(`${SUBCATEGORIES_PAGED_URL}/${pageToNavigateTo}`)
    },
    [navigate]
  )

  return (
    <Fragment>
      <PageHeader
        dataTestId={'settings-page-header'}
        title={`Subcategorieën ${count ? `(${count})` : ''}`}
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

          {!isLoading && count > PAGE_SIZE && (
            <Column span={12}>
              <StyledCompactPager
                data-testid="pagination"
                collectionSize={count}
                pageSize={PAGE_SIZE}
                page={page}
                onPageChange={onPaginationClick}
              />
            </Column>
          )}
        </Column>
      </Row>
    </Fragment>
  )
}

export default OverviewContainer
