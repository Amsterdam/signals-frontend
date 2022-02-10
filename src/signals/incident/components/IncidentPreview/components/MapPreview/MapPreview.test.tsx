// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'

import type { MapStaticProps } from 'components/MapStatic/MapStatic'
import type { Incident } from 'types/incident'

import { mock } from 'types/incident'
import type { FeatureType } from 'signals/incident/components/form/MapSelectors/types'
import { formatAddress } from 'shared/services/format-address'
import { UNKNOWN_TYPE } from '../../../form/MapSelectors/constants'
import MapPreview from '.'

jest.mock('shared/services/configuration/configuration')

jest.mock(
  'components/MapStatic',
  () =>
    ({ iconSrc, ...props }: MapStaticProps) =>
      (
        <>
          <span data-testid="mapStatic" {...props} />
          {iconSrc && (
            <img data-testid="mapStaticMarker" src={iconSrc} alt="" />
          )}
        </>
      )
)

const incident: Incident = mock
const featureTypes: FeatureType[] = [
  {
    label: 'Restafval',
    description: 'Restafval container',
    icon: {
      options: {},
      iconUrl: '/assets/images/marker.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Rest',
  },
]
const coordinates = {
  lat: 52,
  lng: 4,
}
const value = {
  selection: {
    location: {
      coordinates,
    },
    id: 'noop',
    type: 'Rest',
    label: 'Rest - noop',
  },
}
const props = {
  incident,
  value,
  featureTypes,
}

describe('signals/incident/components/IncidentPreview/components/MapPreview', () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })

  it('renders address', () => {
    const address = {
      postcode: '1000 AA',
      huisnummer: 100,
      woonplaats: 'Amsterdam',
      openbare_ruimte: 'West',
    }
    const propsWithAddress = {
      ...props,
      incident: {
        ...incident,
        location: {
          ...incident.location,
          address,
        },
      },
    }

    const { rerender } = render(withAppContext(<MapPreview {...props} />))

    expect(screen.queryByText(formatAddress(address))).not.toBeInTheDocument()

    rerender(withAppContext(<MapPreview {...propsWithAddress} />))

    expect(screen.getByText(formatAddress(address))).toBeInTheDocument()
  })

  it('should render interactive map with useStaticMapServer disabled', () => {
    configuration.featureFlags.useStaticMapServer = false
    const noAddress = {
      ...props,
      incident: {
        ...incident,
        location: {
          ...incident.location,
          address: undefined,
        },
      },
    }
    render(withAppContext(<MapPreview {...noAddress} />))

    expect(screen.getByText('Locatie gepind op de kaart')).toBeInTheDocument()
    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).toBeInTheDocument()
  })

  it('should render static map with useStaticMapServer enabled', () => {
    configuration.featureFlags.useStaticMapServer = true

    render(withAppContext(<MapPreview {...props} />))

    expect(screen.getByTestId('mapStatic')).toBeInTheDocument()
    expect(screen.getByTestId('mapStaticMarker')).toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).not.toBeInTheDocument()
  })

  it('renders marker', () => {
    const specificValue = {
      ...props,
      value: {
        ...value,
        type: 'not-on-map',
      },
    }

    const { rerender } = render(
      withAppContext(<MapPreview {...specificValue} />)
    )
    expect(screen.queryByTestId('mapStaticMarker')).not.toBeInTheDocument()

    const specificFeatureTypes = {
      ...props,
      featureTypes: [
        {
          label: 'Restafval',
          description: 'Restafval container',
          icon: {
            options: {},
            iconUrl: '/assets/images/marker.svg',
          },
          idField: 'id_nummer',
          typeField: 'fractie_omschrijving',
          typeValue: 'GFT',
        },
      ],
    }

    rerender(withAppContext(<MapPreview {...specificFeatureTypes} />))
    expect(screen.queryByTestId('mapStaticMarker')).not.toBeInTheDocument()
  })

  describe('Location description', () => {
    it('When an object is selected', () => {
      render(withAppContext(<MapPreview {...props} />))
      expect(screen.queryByTestId('locationDescription')).toBeInTheDocument()
      expect(screen.queryByTestId('typeIcon')).toBeInTheDocument()
      expect(screen.queryByTestId('selectionLabel')).toBeInTheDocument()
      expect(screen.queryByTestId('mapAddress')).toBeInTheDocument()
    })

    it('When the selection has an address and a gps location', () => {
      const propsAddress = {
        ...props,
        value: {
          ...value,
          selection: {
            location: {
              coordinates,
            },
          },
        },
      }
      render(withAppContext(<MapPreview {...propsAddress} />))
      expect(screen.queryByTestId('locationDescription')).toBeInTheDocument()
      expect(screen.queryByTestId('typeIcon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('selectionLabel')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mapAddress')).toBeInTheDocument()
    })

    it('A selected object is not on the map', () => {
      const propsNotOnMap = {
        ...props,
        value: {
          ...value,
          selection: {
            ...value.selection,
            type: UNKNOWN_TYPE,
          },
        },
      }

      render(withAppContext(<MapPreview {...propsNotOnMap} />))
      expect(screen.queryByTestId('locationDescription')).toBeInTheDocument()
      expect(screen.queryByTestId('typeIcon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('selectionLabel')).toBeInTheDocument()
      expect(screen.queryByTestId('mapAddress')).toBeInTheDocument()
    })
  })
})
