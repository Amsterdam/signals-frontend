// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { lazy, Suspense } from 'react'

import LoadingIndicator from 'components/LoadingIndicator'

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const IncidentMap = lazy(() => import('../components/IncidentMap/IncidentMap'))

export const IncidentMapContainer = () => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <IncidentMap />
    </Suspense>
  )
}
