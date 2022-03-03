// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import 'jest-styled-components'

import * as auth from 'shared/services/auth/auth'
import { withAppContext } from 'test/utils'
import { formatAddress } from 'shared/services/format-address'
import { mock } from 'types/incident'

import Summary from 'components/Summary'
import { address, summaryProps } from 'components/Summary/Summary.test'
import configuration from 'shared/services/configuration/configuration'
import type { MapStaticProps } from 'components/MapStatic/MapStatic'
import type { IncidentPreviewProps } from './IncidentPreview'

import PreviewComponents from './components'
import IncidentPreview from '.'

jest.mock('shared/services/auth/auth')
jest.mock('shared/services/configuration/configuration')
jest.mock('components/MapStatic', () => ({ iconSrc }: MapStaticProps) => (
  <span data-testid="mapStatic">
    <img src={iconSrc} alt="" />
  </span>
))

const incident = {
  ...mock,
  dateTime: new Date().getTime(),
}

describe('<IncidentPreview />', () => {
  let props: IncidentPreviewProps

  beforeEach(() => {
    configuration.featureFlags.useStaticMapServer = true
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    props = {
      incident,
      preview: {
        beschrijf: {
          phone: {
            label: 'Uw (mobiele) telefoon',
            render: ({ value }: { value: string }) => <span>{value}</span>,
          },
          other_prop: {
            label: 'Foo bar',
            authenticated: true,
            render: ({ value }: { value: string }) => <span>{value}</span>,
          },
          optional_prop: {
            label: 'Bazzzz',
            optional: true,
            render: ({ value }: { value: string }) => <span>{value}</span>,
          },
          optional_array_prop: {
            label: 'Opttt',
            optional: true,
            render: ({ value }: { value: string }) => <span>{value}</span>,
          },
          required_prop: {
            label: 'Qux',
            authenticated: false,
            optional: false,
            render: ({ value }: { value: string }) => <span>{value}</span>,
          },
        },
        vulaan: {
          email: {
            label: 'Uw e-mailadres',
            render: ({ value }: { value: string }) => <span>{value}</span>,
          },
        },
        contact: {
          sharing_allowed: {
            optional: true,
            label: 'foo bar',
            render: ({ value }: { value: { value?: string } }) => (
              <span>{value.value ? 'Ja' : 'Nee'}</span>
            ),
          },
        },
        summary: {},
        opslaan: {},
        bedankt: {},
        fout: {},
      },
      sectionLabels: {
        heading: {
          vulaan: 'Vulaan heading',
          beschrijf: 'Beschrijf heading',
          contact: 'Contact',
        },
        edit: {
          vulaan: 'Wijzig vulaan',
          beschrijf: 'Wijzig beschrijf',
          contact: 'Wijzig bar baz qux',
        },
      },
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('expect to render correctly', async () => {
    render(withAppContext(<IncidentPreview {...props} />))

    await screen.findByTestId('incidentPreview')

    expect(screen.queryByText(props.incident.phone || '')).toBeInTheDocument()
    expect(
      screen.queryByText(props.preview.beschrijf.phone.label)
    ).toBeInTheDocument()

    expect(screen.queryByText(props.incident.email)).toBeInTheDocument()
    expect(
      screen.queryByText(props.preview.vulaan.email.label)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(props.preview.beschrijf.other_prop.label)
    ).not.toBeInTheDocument()

    // optional prop without value should not be in the DOM
    expect(
      screen.queryByText(props.preview.beschrijf.optional_prop.label)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(props.preview.beschrijf.optional_array_prop.label)
    ).not.toBeInTheDocument()

    // required prop without value should be in the DOM
    expect(
      screen.queryByText(props.preview.beschrijf.required_prop.label)
    ).toBeInTheDocument()
  })

  it('should have links', async () => {
    const { container } = render(withAppContext(<IncidentPreview {...props} />))

    await screen.findByTestId('incidentPreview')

    const sectionRe = new RegExp(Object.keys(props.preview).join('|'))

    expect(
      screen.getByText(props.sectionLabels.edit.beschrijf)
    ).toBeInTheDocument()
    expect(
      screen.getByText(props.sectionLabels.edit.vulaan)
    ).toBeInTheDocument()

    container.querySelectorAll('a').forEach((element) => {
      expect(element.href).toEqual(expect.stringMatching(sectionRe))
    })
  })

  describe('rendering of all value types', () => {
    const allTypesProps = {
      sectionLabels: {
        heading: {
          beschrijf: 'Beschrijf',
          vulaan: 'Aanvullen',
          contact: 'Contact',
        },
        edit: {
          beschrijf: 'Wijzig beschrijf',
          vulaan: 'Wijzig aanvullen',
          contact: 'Wijzig contact',
        },
      },
      incident,
      preview: {
        beschrijf: {
          plain_text: {
            label: 'Plain text',
            render: ({ value }: { value: string }) => <span>{value}</span>,
          },
          objectValue: {
            label: 'Object value',
            render: ({ value }: { value: { label?: string } }) => (
              <span>{value?.label}</span>
            ),
          },
          listObjectValue: {
            label: 'List object value',
            render: PreviewComponents.ListObjectValue,
          },
          datetime: {
            label: 'Tijdstip',
            render: PreviewComponents.DateTime,
          },
          location: {
            label: 'Locatie',
            render: () => Summary(summaryProps),
          },
        },
        vulaan: {},
        contact: {
          sharing_allowed: {
            optional: true,
            label: 'foo bar',
            render: PreviewComponents.ListObjectValue,
          },
          phone: {
            optional: true,
            label: 'phone',
            render: ({ value }: { value: string }) => <span>{value}</span>,
          },
        },
      },
    }

    it('expect to render correctly', async () => {
      render(
        // Disabling linter; ts compiler is complaining about untyped components. When all components have been ported to TS, the comments can be removed
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        withAppContext(<IncidentPreview {...allTypesProps} />)
      )

      await screen.findByTestId('incidentPreview')

      const { beschrijf, contact } = allTypesProps.preview

      expect(screen.queryByText(beschrijf.plain_text.label)).toBeInTheDocument()

      expect(
        screen.queryByText(beschrijf.objectValue.label)
      ).toBeInTheDocument()
      expect(
        screen.queryByText(contact.sharing_allowed.label)
      ).toBeInTheDocument()

      expect(screen.getByText(formatAddress(address))).toBeInTheDocument()
    })
  })
})
