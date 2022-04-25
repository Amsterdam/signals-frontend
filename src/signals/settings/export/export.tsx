import { Button, Column, Row } from '@amsterdam/asc-ui'
import PageHeader from 'signals/settings/components/PageHeader'
import { Fragment, useCallback, useEffect } from 'react'
import { useFetch } from 'hooks'

const EXPORT_URL = 'http://localhost:8000/signals/v1/private/csv'

const ExportContainer = () => {
  const { get, data, error, isLoading } = useFetch<Blob>()

  const download = useCallback(() => {
    get(EXPORT_URL, {}, { responseType: 'blob' })
  }, [get])

  useEffect(() => {
    if (data) {
      window.location.assign(window.URL.createObjectURL(data))
    }
  }, [data])

  return (
    <Fragment>
      <PageHeader title="Export" />
      <Row>
        <Column span={12} wrap>
          <Button variant="primary" onClick={download}>
            Download export
          </Button>
        </Column>
      </Row>
      {isLoading && <Row>Downloading...</Row>}
      {error && (
        <Row>
          Er ging iets mis: {(error as any).name} {(error as any).message}
        </Row>
      )}
    </Fragment>
  )
}

export default ExportContainer
