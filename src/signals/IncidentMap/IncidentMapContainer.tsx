// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { lazy, Suspense } from 'react'
import { Row, Column } from '@amsterdam/asc-ui'
import LoadingIndicator from 'components/LoadingIndicator'

const IncidentMap = lazy(() => import('./components/IncidentMap'))

const IncidentMapContainer = () => {
  return (
    <Row>
      <Column span={12}>
        <Suspense fallback={<LoadingIndicator />}>
          <IncidentMap />
        </Suspense>
      </Column>
    </Row>
  )
}

export default IncidentMapContainer
