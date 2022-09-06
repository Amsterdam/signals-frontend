// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Suspense } from 'react'
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import { IncidentMapContainer } from './IncidentMapContainer'

const withSuspense = () =>
  withAppContext(
    <Suspense fallback={<div>Loading...</div>}>
      <IncidentMapContainer />
    </Suspense>
  )

describe('signals/IncidentMap/IncidentMapContainer', () => {
  it('should render correctly', async () => {
    const { findByTestId, queryByTestId } = render(withSuspense())

    await findByTestId('incidentMap')

    expect(queryByTestId('incidentMap')).toBeInTheDocument()
  })
})
