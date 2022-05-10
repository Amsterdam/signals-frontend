import { Button, Column, ErrorMessage, Label, Row } from '@amsterdam/asc-ui'
import PageHeader from 'signals/settings/components/PageHeader'
import { Fragment, useCallback, useEffect } from 'react'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'

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
      <PageHeader title="CSV Export" />
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
              message={`Er ging iets mis: ${(error as any).name || ''} ${
                (error as any).message || ''
              }`}
            />
          )}
        </Column>
      </Row>
    </Fragment>
  )
}

export default ExportContainer
