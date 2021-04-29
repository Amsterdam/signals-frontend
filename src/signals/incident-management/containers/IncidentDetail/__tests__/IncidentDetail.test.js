// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'
import * as reactRedux from 'react-redux'

import * as categoriesSelectors from 'models/categories/selectors'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import { subCategories } from 'utils/__tests__/fixtures'
import useEventEmitter from 'hooks/useEventEmitter'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { patchIncidentSuccess } from 'signals/incident-management/actions'

import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'

import IncidentDetail from '..'

jest.spyOn(window, 'scrollTo')
jest
  .spyOn(categoriesSelectors, 'makeSelectSubCategories')
  .mockImplementation(() => subCategories)

// prevent fetch requests that we don't need to verify
jest.mock('components/MapStatic', () => () => <span data-testid="mapStatic" />)

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('shared/services/configuration/configuration')
jest.mock('hooks/useEventEmitter')

const emit = jest.fn()
useEventEmitter.mockReturnValue({
  listenFor: jest.fn(),
  unlisten: jest.fn(),
  emit,
})

const id = incidentFixture.id

// This test suite relies on internals of components that are rendered by the IncidentDetail container component
// to be able to ensure that closing of preview and edit views work.
describe('signals/incident-management/containers/IncidentDetail', () => {
  beforeAll(() => {
    fetchMock.disableMocks()
  })

  beforeEach(() => {
    dispatch.mockReset()
    emit.mockReset()

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ id }))
  })

  afterEach(() => {
    configuration.__reset()
  })

  it('should render correctly', async () => {
    render(withAppContext(<IncidentDetail />))

    expect(await screen.findByTestId('incidentDetail')).toBeInTheDocument()
    expect(
      await screen.findByTestId('attachmentsDefinition')
    ).toBeInTheDocument()
    expect(
      await screen.findByTestId('detail-context-value')
    ).toBeInTheDocument()
    expect(await screen.findByTestId('detail-location')).toBeInTheDocument()
    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(await screen.findByTestId('mapDetail')).toBeInTheDocument()

    expect(await screen.findByTestId('history')).toBeInTheDocument()
    expect(await screen.findAllByTestId('childIncidentHistory')).toHaveLength(3)
    expect(await screen.findByTestId('childIncidents')).toBeInTheDocument()
  })

  it('should not retrieve data', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({}))

    render(withAppContext(<IncidentDetail />))

    expect(screen.queryByTestId('incidentDetail')).not.toBeInTheDocument()
  })

  it('should get handling times from subcategories', () => {
    const handlingTimes = categoriesSelectors.makeSelectHandlingTimesBySlug.resultFunc(
      subCategories
    )

    expect(handlingTimes['auto-scooter-bromfietswrak']).toBe('21 dagen')
    expect(handlingTimes.parkeerautomaten).toBe('5 werkdagen')
  })

  it('should not get child incidents if it does not have them', async () => {
    mockRequestHandler({
      url: `${configuration.INCIDENT_PRIVATE_ENDPOINT}${incidentFixture.id}`,
      body: {
        ...incidentFixture,
        ...incidentFixture,
        _links: { ...incidentFixture._links, 'sia:children': undefined },
      },
    })

    render(withAppContext(<IncidentDetail />))

    // Run await twice to ensure enough renders for component to fetch /children (if it were buggy)
    await screen.findByTestId('incidentDetail')
    await screen.findByTestId('incidentDetail')

    expect(screen.queryByTestId('childIncidents')).not.toBeInTheDocument()
  })

  it('should not fetch context data for incidents with parent incident', async () => {
    mockRequestHandler({
      url: `${configuration.INCIDENT_PRIVATE_ENDPOINT}${incidentFixture.id}`,
      body: {
        ...incidentFixture,
        _links: {
          ...incidentFixture._links,
          'sia:parent': {
            href:
              'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/5319',
          },
        },
      },
    })

    render(withAppContext(<IncidentDetail />))
    await screen.findByTestId('incidentDetail')

    act(() => {
      expect(
        screen.queryByTestId('detail-context-value')
      ).not.toBeInTheDocument()
    })

    await screen.findByTestId('incidentDetail')
  })

  it('should retrieve data when id param changes', async () => {
    const { rerender } = render(withAppContext(<IncidentDetail />))

    expect(await screen.findByText(incidentFixture.text)).toBeInTheDocument()

    mockRequestHandler({
      url: `${configuration.INCIDENT_PRIVATE_ENDPOINT}6666`,
      body: {
        ...incidentFixture,
        text: 'Een andere melding',
      },
    })

    reactRouterDom.useParams.mockImplementation(() => ({
      id: '6666',
    }))

    rerender(withAppContext(<IncidentDetail />))

    expect(await screen.findByText('Een andere melding')).toBeInTheDocument()
    await screen.findByTestId('incidentDetail')
  })

  it('should render correctly with useStaticMapServer enabled', async () => {
    configuration.featureFlags.useStaticMapServer = true
    render(withAppContext(<IncidentDetail />))

    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mapDetail')).not.toBeInTheDocument()

    await screen.findByTestId('incidentDetail')

    expect(screen.getByTestId('mapStatic')).toBeInTheDocument()
    expect(screen.queryByTestId('mapDetail')).not.toBeInTheDocument()

    await screen.findByTestId('incidentDetail')
  })

  it('should handle Esc key', async () => {
    const { container } = render(withAppContext(<IncidentDetail />))
    userEvent.click(await screen.findByTestId('previewLocationButton'))
    userEvent.click(screen.getByText('Locatie wijzigen'))

    expect(screen.getByText('Locatie opslaan')).toBeInTheDocument()
    userEvent.type(container, '{esc}')
    expect(screen.queryByText('Locatie opslaan')).not.toBeInTheDocument()

    await screen.findByTestId('incidentDetail')
  })

  it('should not respond to other key presses', async () => {
    const { container } = render(withAppContext(<IncidentDetail />))
    userEvent.click(await screen.findByTestId('previewLocationButton'))
    userEvent.click(screen.getByText('Locatie wijzigen'))

    expect(screen.getByText('Locatie opslaan')).toBeInTheDocument()
    userEvent.type(container, 'Some other keys')
    expect(screen.queryByText('Locatie opslaan')).toBeInTheDocument()

    await screen.findByTestId('incidentDetail')
  })

  it('renders status form', async () => {
    render(withAppContext(<IncidentDetail />))

    const editStatusButton = await screen.findByTestId('editStatusButton')

    expect(screen.queryByTestId('statusForm')).not.toBeInTheDocument()
    expect(window.scrollTo).not.toHaveBeenCalled()

    userEvent.click(editStatusButton)

    expect(screen.queryByTestId('statusForm')).toBeInTheDocument()
    expect(window.scrollTo).toHaveBeenCalledTimes(1)

    userEvent.click(await screen.findByTestId('statusFormCancelButton'))
    await screen.findByTestId('incidentDetail')

    expect(screen.queryByTestId('statusForm')).not.toBeInTheDocument()
    expect(window.scrollTo).toHaveBeenCalledTimes(2)

    await screen.findByTestId('editStatusButton')
    await screen.findByTestId('incidentDetail')
  })

  it('renders attachment viewer', async () => {
    render(withAppContext(<IncidentDetail />))

    const attachmentsValueButton = await screen.findByTestId(
      'attachmentsValueButton'
    )

    expect(
      screen.queryByTestId('attachment-viewer-image')
    ).not.toBeInTheDocument()

    userEvent.click(attachmentsValueButton)

    expect(screen.queryByTestId('attachment-viewer-image')).toBeInTheDocument()
    await screen.findByTestId('incidentDetail')
  })

  it('closes previews when close button is clicked', async () => {
    render(withAppContext(<IncidentDetail />))

    const attachmentsValueButton = await screen.findByTestId(
      'attachmentsValueButton'
    )

    expect(
      screen.queryByTestId('attachment-viewer-image')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('closeButton')).not.toBeInTheDocument()

    userEvent.click(attachmentsValueButton)

    expect(screen.queryByTestId('attachment-viewer-image')).toBeInTheDocument()
    expect(screen.queryByTestId('closeButton')).toBeInTheDocument()

    userEvent.click(screen.queryByTestId('closeButton'))

    expect(
      screen.queryByTestId('attachment-viewer-image')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('closeButton')).not.toBeInTheDocument()

    await screen.findByTestId('incidentDetail')
  })

  it('should handle successful PATCH', async () => {
    render(withAppContext(<IncidentDetail />))

    await screen.findByTestId('incidentDetail')

    act(() => {
      userEvent.click(screen.getByTestId('addNoteNewNoteButton'))
    })

    userEvent.type(screen.getByTestId('addNoteText'), 'Foo bar baz')

    expect(emit).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))
    })

    await screen.findByTestId('incidentDetail')
    await screen.findByTestId('incidentDetail')

    expect(emit).toHaveBeenCalledWith('highlight', { type: 'notes' })
    expect(dispatch).toHaveBeenCalledWith(patchIncidentSuccess())

    await screen.findByTestId('incidentDetail')
  })

  describe('handling errors', () => {
    beforeEach(async () => {
      render(withAppContext(<IncidentDetail />))

      await screen.findByTestId('incidentDetail')

      act(() => {
        userEvent.click(screen.getByTestId('addNoteNewNoteButton'))
      })

      act(() => {
        userEvent.type(screen.getByTestId('addNoteText'), 'Foo bar baz')
      })

      await screen.findByTestId('incidentDetail')
    })

    it('should handle generic', async () => {
      mockRequestHandler({
        method: 'patch',
        status: 400,
        body: 'Bad request',
      })

      expect(emit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()

      act(() => {
        userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))
      })

      await screen.findByTestId('incidentDetail')

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          showGlobalNotification(
            expect.objectContaining({
              type: TYPE_LOCAL,
              variant: VARIANT_ERROR,
            })
          )
        )
      })
      expect(emit).not.toHaveBeenCalled()
      await screen.findByTestId('incidentDetail')
    })

    it('should handle 401', async () => {
      mockRequestHandler({
        method: 'patch',
        status: 401,
        body: 'Unauthorized',
      })

      expect(emit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()

      act(() => {
        userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))
      })

      await screen.findByTestId('incidentDetail')

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          showGlobalNotification(
            expect.objectContaining({
              title: 'Geen bevoegdheid',
            })
          )
        )
      })
      expect(emit).not.toHaveBeenCalled()
    })

    it('should handle 403', async () => {
      mockRequestHandler({
        method: 'patch',
        status: 403,
        body: 'Forbidden',
      })

      expect(emit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()

      act(() => {
        userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))
      })

      await screen.findByTestId('incidentDetail')

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          showGlobalNotification(
            expect.objectContaining({
              title: 'Geen bevoegdheid',
            })
          )
        )
      })
      expect(emit).not.toHaveBeenCalled()
      await screen.findByTestId('incidentDetail')
    })
  })
})
