import { useEffect, useState } from 'react'

import { Column, Row } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'

import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import { getErrorMessage } from 'shared/services/api/api'
import configuration from 'shared/services/configuration/configuration'

import { StyledColumn } from './styled'
import { Summary } from '../Summary'
import type { StandardText } from '../Summary/Summary'

interface Data {
  count: number
  results: StandardText[]
  _links: {
    next: {
      href: string | null
    }
    previous: {
      href: string | null
    }
    self: {
      href: string
    }
  }
}

export const OverviewPage = () => {
  const dispatch = useDispatch()
  const [standardTexts, setStandardTexts] = useState<StandardText[]>()

  const { get, data, isLoading, error } = useFetch<Data>()

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

      <Column span={4}>
        <div>[FILTER]</div>
      </Column>

      <StyledColumn span={8}>
        <div>[SEARCH BAR]</div>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          standardTexts?.map((text) => {
            return <Summary standardText={text} key={text.id} />
          })
        )}
      </StyledColumn>
    </Row>
  )
}
