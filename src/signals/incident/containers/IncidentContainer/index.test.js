// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
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
  getIsAuthenticated: () => true,
}))

jest.mock('signals/incident/components/IncidentClassification', () => () => (
  <span data-testid="incident-classification" />
))
jest.mock('signals/incident/components/IncidentWizard', () => () => (
  <span data-testid="incident-wizard" />
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
    removeQuestionDataAction: jest.fn(),
    addToSelectionAction: jest.fn(),
    removeFromSelectionAction: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', async () => {
    const { findByTestId, queryByTestId } = render(withSuspense(props))

    await findByTestId('incident-wizard')

    expect(queryByTestId('incident-wizard')).toBeInTheDocument()
    expect(queryByTestId('incident-classification')).not.toBeInTheDocument()
  })

  it('should render correctly when category should be set', async () => {
    jest
      .spyOn(reactRouterDom, 'useLocation')
      .mockImplementation(() => ({ pathname: '/categorie/cat/sub' }))
    const { findByTestId, queryByTestId } = render(withSuspense(props))

    await findByTestId('incident-classification')

    expect(queryByTestId('incident-wizard')).not.toBeInTheDocument()
    expect(queryByTestId('incident-classification')).toBeInTheDocument()
  })
})
