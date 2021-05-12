// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen, waitFor /*waitFor*/ } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'
import * as catgorySelectors from 'models/categories/selectors'
import { subCategories } from 'utils/__tests__/fixtures'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import { showGlobalNotification } from 'containers/App/actions'
import type { Incident as IncidentType } from '../../../IncidentDetail/types'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../../internals/testing/msw-server'

import IncidentDetail from '../IncidentDetail'

const incident: IncidentType = {
  _links: {
    curies: {
      name: 'sia',
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/relations',
    },
    self: {
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/7859',
    },
    archives: {
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/7859/history',
    },
    'sia:attachments': {
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/7859/attachments',
    },
    'sia:pdf': {
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/7859/pdf',
    },
    'sia:context': {
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/7859/context',
    },
    'sia:parent': {
      href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/7741',
    },
  },
  _display: '7859 - i - None - 2021-04-29T09:35:32.262221+02:00',
  category: {
    sub: 'Overig afval',
    sub_slug: 'overig-afval',
    main: 'Afval',
    main_slug: 'afval',
    category_url:
      'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/overig-afval',
    departments: 'ASC, AEG, STW',
    created_by: 'a.tudorache@amsterdam.nl',
    text: null,
    deadline: '2021-05-04T09:35:32.262221+02:00',
    deadline_factor_3: '2021-05-12T09:35:32.262221+02:00',
  },
  id: 7859,
  has_attachments: false,
  location: {
    id: 8662,
    stadsdeel: 'A',
    buurt_code: null,
    area_type_code: null,
    area_code: null,
    address: {
      postcode: '1016LH',
      huisletter: '',
      huisnummer: 134,
      woonplaats: 'Amsterdam',
      openbare_ruimte: 'Bloemstraat',
      huisnummer_toevoeging: '2',
    },
    address_text: 'Bloemstraat 134-2 1016LH Amsterdam',
    geometrie: {
      type: 'Point',
      coordinates: [4.879072679753966, 52.37371850779132],
    },
    extra_properties: {
      original_address: {
        postcode: '1016LH',
        huisletter: '',
        huisnummer: 134,
        woonplaats: 'Amsterdam',
        openbare_ruimte: 'Bloemstraat',
        huisnummer_toevoeging: '2',
      },
    },
    created_by: 'a.tudorache@amsterdam.nl',
    bag_validated: true,
  },
  status: {
    text: 'In behandeling via HNW app',
    user: 'rob@apptimize.nl',
    state: 'i',
    state_display: 'In afwachting van behandeling',
    target_api: null,
    extra_properties: null,
    send_email: false,
    created_at: '2021-04-29T09:40:02.997474+02:00',
  },
  reporter: {
    email: 'h.oldenbeuving@amsterdam.nl',
    phone: '',
    sharing_allowed: false,
  },
  priority: { priority: 'normal', created_by: 'a.tudorache@amsterdam.nl' },
  notes: [],
  type: {
    code: 'SIG',
    created_at: '2021-04-29T09:35:32.276824+02:00',
    created_by: 'a.tudorache@amsterdam.nl',
  },
  source: 'Interne melding',
  text: 'sdfsdfsd',
  text_extra: '',
  extra_properties: null,
  created_at: '2021-04-29T09:35:32.262221+02:00',
  updated_at: '2021-04-29T09:40:03.002597+02:00',
  incident_date_start: '2021-04-22T13:54:48+02:00',
  incident_date_end: null,
  routing_departments: null,
  attachments: [],
  assigned_user_email: null,
}

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
      .mockImplementation(() => [...subCategories])

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
