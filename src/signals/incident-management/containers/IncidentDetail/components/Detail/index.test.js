// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import configuration from 'shared/services/configuration/configuration'

import IncidentDetailContext from '../../context'
import Detail from '.'

jest.mock('shared/services/configuration/configuration')

describe('<Detail />', () => {
  afterEach(() => {
    configuration.__reset()
  })

  const props = {
    context: {
      near: {
        signal_count: 12,
      },
    },
    attachments: [
      {
        _display: 'Attachment object (946)',
        _links: { self: { href: '/signals/4935/attachments' } },
        location: '/winther-viking-fiets-47400-2701016038.jpg',
        is_image: true,
        created_at: '2020-03-31T12:10:18.367047+02:00',
      },
      {
        _display: 'Attachment object (947)',
        _links: { self: { href: '/signals/4935/attachments' } },
        location: '/red-and-multicolored-abstract-painting-3577981.jpg',
        is_image: true,
        created_at: '2020-03-31T12:10:18.583548+02:00',
      },
    ],
  }

  it('should render correctly', async () => {
    configuration.featureFlags.enableNearIncidents = true
    const { getByTestId, getByText, findByTestId } = render(
      withAppContext(
        <IncidentDetailContext.Provider value={{ incident: incidentFixture }}>
          <Detail {...props} />
        </IncidentDetailContext.Provider>
      )
    )

    await findByTestId('detail-title')

    expect(getByTestId('detail-title')).toHaveTextContent(incidentFixture.text)

    expect(getByTestId('detail-email-definition')).toHaveTextContent(
      /^E-mail melder$/
    )
    expect(getByTestId('detail-email-value')).toHaveTextContent(
      incidentFixture.reporter.email
    )
    expect(getByTestId('detail-phone-definition')).toHaveTextContent(
      /^Telefoon melder$/
    )
    expect(getByTestId('detail-phone-value')).toHaveTextContent(
      incidentFixture.reporter.phone
    )
    expect(getByTestId('detail-sharing-definition')).toHaveTextContent(
      'Toestemming contactgegevens delen'
    )
    expect(getByTestId('detail-sharing-value')).toHaveTextContent('Nee')

    expect(
      getByText(incidentFixture.extra_properties[0].label)
    ).toBeInTheDocument()
    expect(
      getByText(incidentFixture.extra_properties[1].label)
    ).toBeInTheDocument()
    expect(getByTestId('attachmentsDefinition')).toBeInTheDocument()
    expect(getByTestId('detail-location')).toBeInTheDocument()
  })

  it('should only render elements that have data', async () => {
    configuration.featureFlags.enableNearIncidents = true
    const reporterNoPhone = {
      reporter: {
        email: 'foo@bar.com',
      },
    }

    const { queryByTestId, findByTestId, unmount, rerender } = render(
      withAppContext(
        <IncidentDetailContext.Provider
          value={{ incident: { ...incidentFixture, ...reporterNoPhone } }}
        >
          <Detail {...props} />
        </IncidentDetailContext.Provider>
      )
    )

    await findByTestId('detail-title')

    expect(queryByTestId('detail-phone-definition')).toBeInTheDocument()
    expect(queryByTestId('detail-email-definition')).toBeInTheDocument()

    unmount()

    const reporterNoEmail = {
      reporter: {
        phone: '14020',
      },
    }

    rerender(
      withAppContext(
        <IncidentDetailContext.Provider
          value={{ incident: { ...incidentFixture, ...reporterNoEmail } }}
        >
          <Detail {...props} />
        </IncidentDetailContext.Provider>
      )
    )

    await findByTestId('detail-title')

    expect(queryByTestId('detail-phone-definition')).toBeInTheDocument()
    expect(queryByTestId('detail-email-definition')).toBeInTheDocument()

    unmount()

    const contextNoNearSignals = {
      near: {
        signal_count: null,
      },
    }

    rerender(
      withAppContext(
        <IncidentDetailContext.Provider
          value={{ incident: { ...incidentFixture } }}
        >
          <Detail {...props} context={contextNoNearSignals} />
        </IncidentDetailContext.Provider>
      )
    )

    await findByTestId('detail-title')

    expect(queryByTestId('detail-area-definition')).not.toBeInTheDocument()
  })

  it('should only render phone number in a link when the number is visible', async () => {
    const reporterPhoneVisible = {
      reporter: {
        phone: '1234',
      },
    }

    const { rerender, unmount } = render(
      withAppContext(
        <IncidentDetailContext.Provider
          value={{ incident: { ...incidentFixture, ...reporterPhoneVisible } }}
        >
          <Detail {...props} />
        </IncidentDetailContext.Provider>
      )
    )

    expect(screen.queryByTestId('detail-phone-link')).toBeInTheDocument()

    unmount()

    const reporterPhoneNotVisible = {
      reporter: {
        phone: '***',
      },
    }

    rerender(
      withAppContext(
        <IncidentDetailContext.Provider
          value={{
            incident: { ...incidentFixture, ...reporterPhoneNotVisible },
          }}
        >
          <Detail {...props} />
        </IncidentDetailContext.Provider>
      )
    )

    expect(screen.queryByTestId('detail-phone-link')).not.toBeInTheDocument()
  })
})
