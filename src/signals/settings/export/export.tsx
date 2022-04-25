import { Button, Column, Link, Row } from '@amsterdam/asc-ui'
import PageHeader from 'signals/settings/components/PageHeader'
import { Fragment } from 'react'

const EXPORT_URL = 'http://localhost:8000/signals/v1/private/csv'

const ExportContainer = () => {
  return (
    <Fragment>
      <PageHeader title="Export" />
      <Row>
        <Column span={12} wrap>
          <Button variant="primary" forwardedAs={Link} as="a" href={EXPORT_URL}>
            Download export
          </Button>
        </Column>
      </Row>
    </Fragment>
  )
}

export default ExportContainer
