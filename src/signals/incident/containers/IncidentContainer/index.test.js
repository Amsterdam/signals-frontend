// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { Suspense } from 'react'
import { render } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import { withAppContext } from 'test/utils'
import { IncidentContainerComponent } from '.'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
  isAuthenticated: () => true,
}))

jest.mock('signals/incident/components/IncidentClassification', () => () => (
  <span data-testid="incidentClassification" />
))
jest.mock('signals/incident/components/IncidentWizard', () => () => (
  <span data-testid="incidentWizard" />
))

const withSuspense = (props) =>
  withAppContext(
    <Suspense fallback={<div>Loading...</div>}>
      <IncidentContainerComponent {...props} />
    </Suspense>
  )

describe('signals/incident/containers/IncidentContainer', () => {
  const props = {
    incidentContainer: { incident: {} },
    getClassificationAction: jest.fn(),
    updateIncidentAction: jest.fn(),
    createIncidentAction: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', async () => {
    const { findByTestId, queryByTestId } = render(withSuspense(props))

    await findByTestId('incidentWizard')

    expect(queryByTestId('incidentWizard')).toBeInTheDocument()
    expect(queryByTestId('incidentClassification')).not.toBeInTheDocument()
  })

  it('should render correctly when category should be set', async () => {
    jest
      .spyOn(reactRouterDom, 'useLocation')
      .mockImplementation(() => ({ pathname: '/categorie/cat/sub' }))
    const { findByTestId, queryByTestId } = render(withSuspense(props))

    await findByTestId('incidentClassification')

    expect(queryByTestId('incidentWizard')).not.toBeInTheDocument()
    expect(queryByTestId('incidentClassification')).toBeInTheDocument()
  })
})
