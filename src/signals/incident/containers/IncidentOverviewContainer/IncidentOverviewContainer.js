// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { lazy, Suspense } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const OverviewMap = lazy(() => import('components/OverviewMap'))

export const IncidentOverviewContainer = () => (
  <Row>
    <Column span={12}>
      <Suspense>
        <OverviewMap isPublic />
      </Suspense>
    </Column>
  </Row>
)

export default IncidentOverviewContainer
