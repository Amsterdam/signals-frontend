import { useEffect, useState } from 'react'

import { Column, Row } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'

import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import { getErrorMessage } from 'shared/services/api/api'
import configuration from 'shared/services/configuration/configuration'

import { StyledColumn, StyledPagination, StyledButton } from './styled'
import { useStandardTextAdminContext } from '../../context'
import type { StandardText, StandardTextsData } from '../../types'
import { Summary } from '../Summary'

const PAGE_SIZE = 15

export const OverviewPage = () => {
  const dispatch = useDispatch()
  const [standardTexts, setStandardTexts] = useState<StandardText[]>()

  const { page, setPage } = useStandardTextAdminContext()

  const { get, data, isLoading, error } = useFetch<StandardTextsData>()

  useEffect(() => {
    if (!standardTexts) {
      get(configuration.STANDARD_TEXTS_SEARCH_ENDPOINT)
    }
  }, [get, standardTexts])

  useEffect(() => {
    data && setStandardTexts(data.results)
  }, [data])

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
        <h1>Standaard teksten overzicht</h1>
      </Column>

      <StyledColumn span={4}>
        <div>[FILTER]</div>
        <StyledButton variant="secondary">Tekst toevoegen</StyledButton>
      </StyledColumn>

      <StyledColumn span={8}>
        <div>[SEARCH BAR]</div>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          standardTexts?.map((text) => {
            return <Summary standardText={text} key={text.id} />
          })
        )}

        <StyledPagination
          data-testid="pagination"
          collectionSize={data?.count || 0}
          pageSize={PAGE_SIZE}
          page={page}
          onPageChange={(page) => {
            global.window.scrollTo(0, 0)
            get(`${configuration.STANDARD_TEXTS_SEARCH_ENDPOINT}?page=${page}`)
            setPage(page)
          }}
        />
      </StyledColumn>
    </Row>
  )
}
