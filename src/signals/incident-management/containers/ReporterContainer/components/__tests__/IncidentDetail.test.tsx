// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'
import * as catgorySelectors from 'models/categories/selectors'
import { subCategories } from 'utils/__tests__/fixtures'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import { showGlobalNotification } from 'containers/App/actions'
import type { Incident as IncidentType } from 'types/api/incident'
import { mockIncident } from 'types/api/incident.mock'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../../internals/testing/msw-server'

import IncidentDetail from '../IncidentDetail'

const incident = mockIncident()

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const dispatch = jest.fn()

describe('IncidentDetail', () => {
  beforeAll(() => {
    fetchMock.disableMocks()
  })

  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
    jest
      .spyOn(catgorySelectors, 'makeSelectSubCategories')
      .mockImplementation(() => subCategories || [])

    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ id: '7740' }))
  })

  afterEach(() => {
    jest.resetAllMocks()
    dispatch.mockReset()
  })

  it('should render a standaard incident', async () => {
    render(withAppContext(<IncidentDetail incident={incident} />))

    expect(
      await screen.findByText('Standaardmelding', { exact: false })
    ).toBeInTheDocument()

    await screen.findByRole('list')
    const historyElements = screen.getAllByRole('listitem')
    expect(historyElements).toHaveLength(2)
  })

  it('should render a parent incident', async () => {
    const parentIncident = { ...incident }
    parentIncident._links['sia:children'] = [{ href: '' }]
    render(withAppContext(<IncidentDetail incident={parentIncident} />))

    expect(
      await screen.findByText('Hoofdmelding', { exact: false })
    ).toBeInTheDocument()

    await screen.findByRole('list')
    const historyElements = screen.getAllByRole('listitem')
    expect(historyElements).toHaveLength(2)
  })

  it('should show the correct url to navigate to the incident on the link', async () => {
    render(
      withAppContext(
        <IncidentDetail incident={incidentFixture as unknown as IncidentType} />
      )
    )

    const link = screen.getByRole('link')

    expect(link).toHaveAttribute('href', '/manage/incident/4440')
  })

  it('should show an error when api call fails', async () => {
    mockRequestHandler({
      status: 500,
      body: 'Something went wrong',
    })

    render(
      withAppContext(
        <IncidentDetail incident={incidentFixture as unknown as IncidentType} />
      )
    )

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        showGlobalNotification(
          expect.objectContaining({
            title:
              'De data kon niet opgehaald worden. probeer het later nog eens.',
          })
        )
      )
    )
  })
})
