// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import { Row } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'

import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import { getErrorMessage } from 'shared/services/api/api'
import configuration from 'shared/services/configuration/configuration'

import { Button, Column, P, Pagination, Span, Text, SearchBar } from './styled'
import { useStandardTextAdminContext } from '../../context'
import type { StandardTextsData } from '../../types'
import { Filter } from '../Filter'
import { Summary } from '../Summary'

interface Option {
  key: string
  value: string
}

const PAGE_SIZE = 15

export const OverviewPage = () => {
  const [statusFilter, setStatusFilter] = useState<Option>()
  const [activeFilter, setActiveFilter] = useState<Option>()
  const [searchQuery, setSearchQuery] = useState<string>()

  const dispatch = useDispatch()
  const { page, setPage } = useStandardTextAdminContext()

  const { get, data, isLoading, error } = useFetch<StandardTextsData>()

  const fetchData = useCallback(() => {
    const searchParam = searchQuery ? `&q=${searchQuery}` : ''
    const statusParam = statusFilter?.key ? `&state=${statusFilter.key}` : ''
    const activeParam = activeFilter?.key ? `&active=${activeFilter.key}` : ''

    get(
      `${configuration.STANDARD_TEXTS_SEARCH_ENDPOINT}?${searchParam}${statusParam}${activeParam}`
    )
  }, [activeFilter, get, searchQuery, statusFilter])

  const onSearchSubmit = useCallback((event) => {
    event.preventDefault()
    event.persist()
    const { value } = event.target.querySelector('input')

    setSearchQuery(value)
  }, [])

  useEffect(() => {
    fetchData()
  }, [statusFilter, activeFilter, searchQuery, fetchData])

  useEffect(() => {
    if (error) {
      dispatch(
        showGlobalNotification({
          title: getErrorMessage(error),
          message: 'De standaardteksten konden niet worden opgehaald',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [dispatch, error])

  return (
    <Row>
      <Column span={12}>
        <h1>Standaardteksten overzicht</h1>
      </Column>

      <Column span={4}>
        <Filter
          setStatusFilter={setStatusFilter}
          setActiveFilter={setActiveFilter}
        />
        <Button variant="secondary">Tekst toevoegen</Button>
      </Column>

      <Column span={6}>
        <Text>Zoek op standaardtekst</Text>
        <form onSubmit={onSearchSubmit}>
          <SearchBar
            value={''}
            placeholder="Zoekterm"
            onClear={() => setSearchQuery('')}
            // onChange={fet}
          />
        </form>
        {data?.count === 0 && (
          <Span>
            <Text>Geen resultaten gevonden</Text>
            <P>Probeer een andere zoekcombinatie</P>
          </Span>
        )}

        {isLoading && <LoadingIndicator />}

        {data?.results.map((text) => {
          return <Summary standardText={text} key={text.id} />
        })}

        {!isLoading && data && data.count > PAGE_SIZE && (
          <Pagination
            data-testid="pagination"
            collectionSize={data.count}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={(page) => {
              global.window.scrollTo(0, 0)
              get(
                `${configuration.STANDARD_TEXTS_SEARCH_ENDPOINT}?page=${page}`
              )
              setPage(page)
            }}
          />
        )}
      </Column>
      <Column span={2}> </Column>
    </Row>
  )
}
