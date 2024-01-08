import { Fragment, useCallback, useEffect } from 'react'

import { Button, Column, ErrorMessage, Label, Row } from '@amsterdam/asc-ui'

import BackLink from 'components/BackLink'
import PageHeader from 'components/PageHeader'
import { useFetch } from 'hooks'
import type { FetchError } from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import { BASE_URL } from 'signals/settings/routes'

const ExportContainer = () => {
  const { get, data, error, isLoading } = useFetch<Blob>()

  const download = useCallback(() => {
    get(configuration.EXPORT_ENDPOINT, {}, { responseType: 'blob' })
  }, [get])

  useEffect(() => {
    if (data) {
      window.location.assign(window.URL.createObjectURL(data))
    }
  }, [data])

  return (
    <Fragment>
      <Row>
        <PageHeader
          title="CSV Export"
          BackLink={<BackLink to={BASE_URL}>Terug naar instellingen</BackLink>}
        />
      </Row>
      <Row>
        <Column span={12} wrap>
          <Button variant="primary" onClick={download} disabled={isLoading}>
            Download export
          </Button>
        </Column>
      </Row>
      <Row>
        <Column span={12} wrap>
          {isLoading && <Label label="Downloading..." />}
          {error && (
            <ErrorMessage
              message={`Er ging iets mis: ${
                (error as FetchError).message || ''
              }`}
            />
          )}
        </Column>
      </Row>
    </Fragment>
  )
}

export default ExportContainer
