// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fireEvent, render, act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'
import * as reactRedux from 'react-redux'

import * as categoriesSelectors from 'models/categories/selectors'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import childIncidentFixture from 'utils/__tests__/fixtures/childIncidents.json'
import { subCategories } from 'utils/__tests__/fixtures'
import incidentHistoryFixture from 'utils/__tests__/fixtures/incidentHistory.json'
import useEventEmitter from 'hooks/useEventEmitter'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { patchIncidentSuccess } from 'signals/incident-management/actions'
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

const statusMessageTemplates = [
  {
    state: 'o',
    templates: [
      {
        title: 'Niets gevonden',
        text: 'Er is geen fietswrak gevonden op de aangewezen plek.',
      },
      {
        title: 'Zes wekenregeling',
        text:
          'Dit gebied valt onder de zes wekenregeling en het fietswrak zal worden opgeruimd volgens schema.',
      },
      {
        title: 'Gestickerd',
        text: 'De fiets is gestickerd en zal worden opgehaald.',
      },
      { title: 'Opgeruimd', text: 'Het fietswrak is opgehaald.' },
      {
        title: 'Geen actie',
        text: 'Fiets is van een ambtenaar in functie. Die laten we dus staan.',
      },
    ],
  },
]

const attachments = {
  _links: {
    self: {
      href:
        'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/999999/attachments',
    },
    next: { href: null },
    previous: { href: null },
  },
  count: 1,
  results: [
    {
      _display: 'Attachment object (980)',
      _links: {
        self: {
          href:
            'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/999999/attachments',
        },
      },
      location: 'https://ae70d54aca324d0480ca01934240c78f.jpg',
      is_image: true,
      created_at: '2020-06-10T11:51:24.281272+02:00',
    },
  ],
}

const id = '999999'

// This test suite relies on internals of components that are rendered by the IncidentDetail container component
// to be able to ensure that closing of preview and edit views work.

describe('signals/incident-management/containers/IncidentDetail', () => {
  beforeEach(() => {
    fetch.resetMocks()
    dispatch.mockReset()
    emit.mockReset()

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      id,
    }))

    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }],
      [JSON.stringify(statusMessageTemplates), { status: 200 }],
      [JSON.stringify(incidentHistoryFixture), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }],
      [JSON.stringify(childIncidentFixture), { status: 200 }],
      [JSON.stringify(incidentHistoryFixture), { status: 200 }],
      [JSON.stringify(incidentHistoryFixture), { status: 200 }]
    )
  })

  afterEach(() => {
    configuration.__reset()
  })

  it('should retrieve incident data', async () => {
    render(withAppContext(<IncidentDetail />))

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
      expect.objectContaining({ method: 'GET' })
    )

    expect(fetch).toHaveBeenCalledTimes(1)

    await screen.findByTestId('incidentDetail')

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`,
      expect.objectContaining({ method: 'GET' })
    )

    const { main_slug, sub_slug } = incidentFixture.category

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.TERMS_ENDPOINT}${main_slug}/sub_categories/${sub_slug}/status-message-templates`,
      expect.objectContaining({ method: 'GET' })
    )

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments`,
      expect.objectContaining({ method: 'GET' })
    )

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/children/`,
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('should not retrieve data', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({}))

    render(withAppContext(<IncidentDetail />))

    expect(fetch).not.toHaveBeenCalled()
  })

  it('should get handling times from subcategories', () => {
    const handlingTimes = categoriesSelectors.makeSelectHandlingTimesBySlug.resultFunc(
      subCategories
    )

    expect(handlingTimes['auto-scooter-bromfietswrak']).toBe('21 dagen')
    expect(handlingTimes.parkeerautomaten).toBe('5 werkdagen')
  })

  it('should retrieve default texts and attachments only once', async () => {
    const { rerender } = render(withAppContext(<IncidentDetail />))

    await screen.findByTestId('incidentDetail')

    expect(fetch).toHaveBeenCalledTimes(7)

    rerender(withAppContext(<IncidentDetail />))

    await screen.findByTestId('incidentDetail')

    expect(fetch).toHaveBeenCalledTimes(7)
  })

  it('should not get child incidents', async () => {
    fetch.resetMocks()

    const incidentWithoutChildren = {
      ...incidentFixture,
      _links: { ...incidentFixture._links, 'sia:children': undefined },
    }

    fetch.mockResponses(
      [JSON.stringify(incidentWithoutChildren), { status: 200 }],
      [JSON.stringify(statusMessageTemplates), { status: 200 }],
      [JSON.stringify(incidentHistoryFixture), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }]
    )

    render(withAppContext(<IncidentDetail />))

    await screen.findByTestId('incidentDetail')

    expect(fetch).toHaveBeenCalledTimes(4)

    expect(screen.queryByTestId('childIncidents')).not.toBeInTheDocument()
  })

  it('should retrieve data when id param changes', async () => {
    const { rerender, unmount } = render(withAppContext(<IncidentDetail />))

    await screen.findByTestId('incidentDetail')

    expect(fetch).toHaveBeenCalledTimes(7)

    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }],
      [JSON.stringify(statusMessageTemplates), { status: 200 }],
      [JSON.stringify(incidentHistoryFixture), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }],
      [JSON.stringify(childIncidentFixture), { status: 200 }]
    )

    reactRouterDom.useParams.mockImplementation(() => ({
      id: '6666',
    }))

    unmount()

    rerender(withAppContext(<IncidentDetail />))

    await screen.findByTestId('incidentDetail')

    expect(fetch).toHaveBeenCalledTimes(14)
  })

  it('should render correctly', async () => {
    render(withAppContext(<IncidentDetail />))

    expect(screen.queryByTestId('detail-location')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('attachmentsDefinition')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('history')).not.toBeInTheDocument()
    expect(screen.queryByTestId('childIncidentHistory')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mapPreviewMap')).not.toBeInTheDocument()
    expect(screen.queryByTestId('childIncidents')).not.toBeInTheDocument()

    await screen.findByTestId('incidentDetail')

    expect(screen.queryByTestId('detail-location')).toBeInTheDocument()
    expect(screen.getByTestId('attachmentsDefinition')).toBeInTheDocument()
    expect(screen.getByTestId('history')).toBeInTheDocument()
    expect(screen.getAllByTestId('childIncidentHistory')).toHaveLength(3)
    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(screen.getByTestId('mapDetail')).toBeInTheDocument()
    expect(screen.getByTestId('childIncidents')).toBeInTheDocument()
  })

  it('should render correctly with useStaticMapServer enabled', async () => {
    configuration.featureFlags.useStaticMapServer = true
    render(withAppContext(<IncidentDetail />))

    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mapDetail')).not.toBeInTheDocument()

    await screen.findByTestId('incidentDetail')

    expect(screen.getByTestId('mapStatic')).toBeInTheDocument()
    expect(screen.queryByTestId('mapDetail')).not.toBeInTheDocument()
  })

  it('should handle Escape key', async () => {
    render(withAppContext(<IncidentDetail />))

    const locationButtonShow = await screen.findByTestId(
      'previewLocationButton'
    )

    act(() => {
      fireEvent.click(locationButtonShow)
    })

    const locationPreviewButtonEdit = await screen.findByTestId(
      'location-preview-button-edit'
    )

    act(() => {
      fireEvent.click(locationPreviewButtonEdit)
    })

    await screen.findByTestId('incidentDetail')

    act(() => {
      fireEvent.keyUp(document, { key: 'Escape', code: 13, keyCode: 13 })
    })

    await screen.findByTestId('incidentDetail')

    expect(screen.queryByTestId('previewLocationButton')).toBeInTheDocument()
  })

  it('should handle Esc key', async () => {
    render(withAppContext(<IncidentDetail />))

    const locationButtonShow = await screen.findByTestId(
      'previewLocationButton'
    )

    act(() => {
      fireEvent.click(locationButtonShow)
    })

    const locationPreviewButtonEdit = await screen.findByTestId(
      'location-preview-button-edit'
    )

    act(() => {
      fireEvent.click(locationPreviewButtonEdit)
    })

    await screen.findByTestId('incidentDetail')

    act(() => {
      fireEvent.keyUp(document, { key: 'Esc', code: 13, keyCode: 13 })
    })

    await screen.findByTestId('incidentDetail')

    expect(screen.queryByTestId('previewLocationButton')).toBeInTheDocument()
  })

  it('should not respond to other key presses', async () => {
    render(withAppContext(<IncidentDetail />))

    const locationButtonShow = await screen.findByTestId(
      'previewLocationButton'
    )

    act(() => {
      fireEvent.click(locationButtonShow)
    })

    const locationPreviewButtonEdit = await screen.findByTestId(
      'location-preview-button-edit'
    )

    act(() => {
      fireEvent.click(locationPreviewButtonEdit)
    })

    await screen.findByTestId('incidentDetail')

    act(() => {
      fireEvent.keyUp(document, { key: 'A', code: 65, keyCode: 65 })
    })

    await screen.findByTestId('incidentDetail')

    expect(screen.queryByTestId('previewLocationButton')).toBeInTheDocument()
  })

  it('renders status form', async () => {
    render(withAppContext(<IncidentDetail />))

    const editStatusButton = await screen.findByTestId('editStatusButton')

    expect(screen.queryByTestId('statusForm')).not.toBeInTheDocument()
    expect(window.scrollTo).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(editStatusButton)
    })

    expect(screen.queryByTestId('statusForm')).toBeInTheDocument()
    expect(window.scrollTo).toHaveBeenCalledTimes(1)

    userEvent.click(await screen.findByTestId('statusFormCancelButton'))

    expect(screen.queryByTestId('statusForm')).not.toBeInTheDocument()
    expect(window.scrollTo).toHaveBeenCalledTimes(2)

    await screen.findByTestId('editStatusButton')
  })

  it('renders attachment viewer', async () => {
    render(withAppContext(<IncidentDetail />))

    const attachmentsValueButton = await screen.findByTestId(
      'attachmentsValueButton'
    )

    expect(
      screen.queryByTestId('attachment-viewer-image')
    ).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(attachmentsValueButton)
    })

    expect(screen.queryByTestId('attachment-viewer-image')).toBeInTheDocument()
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

    act(() => {
      fireEvent.click(attachmentsValueButton)
    })

    expect(screen.queryByTestId('attachment-viewer-image')).toBeInTheDocument()
    expect(screen.queryByTestId('closeButton')).toBeInTheDocument()

    act(() => {
      fireEvent.click(screen.queryByTestId('closeButton'))
    })

    expect(
      screen.queryByTestId('attachment-viewer-image')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('closeButton')).not.toBeInTheDocument()
  })

  it('should handle successful PATCH', async () => {
    render(withAppContext(<IncidentDetail />))

    await screen.findByTestId('incidentDetail')

    act(() => {
      fireEvent.click(screen.getByTestId('addNoteNewNoteButton'))
    })

    act(() => {
      fireEvent.change(screen.getByTestId('addNoteText'), {
        target: { value: 'Foo bar baz' },
      })
    })

    expect(fetch).not.toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' })
    )

    fetch.mockResponseOnce(JSON.stringify(incidentFixture))

    expect(emit).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(screen.getByTestId('addNoteSaveNoteButton'))
    })

    expect(fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' })
    )

    await screen.findByTestId('incidentDetail')

    // and should emit highlight event
    expect(emit).toHaveBeenCalledWith('highlight', { type: 'notes' })
    expect(dispatch).toHaveBeenCalledWith(patchIncidentSuccess())

    expect(fetch).toHaveBeenNthCalledWith(
      8,
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
      expect.objectContaining({ method: 'PATCH' })
    )

    // after successful patch should request the defaults texts
    expect(fetch).toHaveBeenNthCalledWith(
      9,
      `${configuration.TERMS_ENDPOINT}afval/sub_categories/asbest-accu/status-message-templates`,
      expect.objectContaining({ method: 'GET' })
    )

    // after successful patch should request history
    expect(fetch).toHaveBeenNthCalledWith(
      10,
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`,
      expect.objectContaining({ method: 'GET' })
    )
  })

  describe('handling errors', () => {
    beforeEach(async () => {
      render(withAppContext(<IncidentDetail />))

      await screen.findByTestId('incidentDetail')

      act(() => {
        fireEvent.click(screen.getByTestId('addNoteNewNoteButton'))
      })

      act(() => {
        fireEvent.change(screen.getByTestId('addNoteText'), {
          target: { value: 'Foo bar baz' },
        })
      })

      await screen.findByTestId('incidentDetail')
    })

    it('should handle generic', async () => {
      const response = { status: 400, ok: false, statusText: 'Bad Request' }
      fetch.mockResponseOnce('', response)
      fetch.mockRejectOnce(new Error('Could not store for some reason'))

      expect(emit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()

      act(() => {
        fireEvent.click(screen.getByTestId('addNoteSaveNoteButton'))
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
    })

    it('should handle 401', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' }
      fetch.mockResponseOnce('', response)

      expect(emit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()

      act(() => {
        fireEvent.click(screen.getByTestId('addNoteSaveNoteButton'))
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
      const response = { status: 403, ok: false, statusText: 'Forbidden' }
      fetch.mockResponseOnce('', response)

      expect(emit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()

      act(() => {
        fireEvent.click(screen.getByTestId('addNoteSaveNoteButton'))
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
  })
})
