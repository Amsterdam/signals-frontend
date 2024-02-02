// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { LatLngLiteral, LatLngTuple } from 'leaflet'

import { UNKNOWN_TYPE } from 'signals/incident/components/form/MapSelectors/constants'
import type { Item } from 'signals/incident/components/form/MapSelectors/types'

import type { Address } from './address'

export type ValueObject = {
  label: string
  value: boolean
}

type ExtraProps = {
  [key: string]: {
    [prop: string]: any
    selection?: Item[]
    location?: Location
  }
}
export interface Incident extends Record<string, any>, ExtraProps {
  category: string
  classification: Classification | null
  dateTime: number | null | string
  description: string
  email: string
  handling_message: string
  images_previews: string[]
  images: string[]
  location: Location
  phone?: string
  priority: Priority
  questions?: []
  sharing_allowed?: ValueObject
  source?: string
  subcategory: string
  type: Priority
}

export interface Classification {
  id: string
  name: string
  slug: string
}

export interface Datetime {
  id: string
  label: string
  info: string
}

export interface Location {
  coordinates: LatLngLiteral
  address?: Address
}

export interface Geometrie {
  type: string
  coordinates: LatLngTuple
}

export interface Priority {
  id: string
  label: string
}

export const mock: Incident = {
  dateTime: null,
  priority: {
    id: 'normal',
    label: 'Normaal',
  },
  sharing_allowed: {
    label:
      'Ja, ik geef de gemeenten Amsterdam en Weesp toestemming om mijn melding door te sturen naar andere organisaties als de melding niet voor de gemeente is bestemd.',
    value: true,
  },
  classification: {
    id: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/overig-groen-en-water',
    name: 'Overig groen en water',
    slug: 'overig-groen-en-water',
  },
  questions: [],
  handling_message:
    'Wij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
  phone: '14 020',
  images_previews: [],
  extra_container: {
    selection: {
      id: '0872453',
      label: 'Dit is het object',
      type: UNKNOWN_TYPE,
    },
  },
  location: {
    coordinates: {
      lat: 52.38931218069618,
      lng: 4.933903676810628,
    },
    address: {
      openbare_ruimte: "'s-Gravenhekje",
      huisnummer: '9',
      postcode: '1011TG',
      woonplaats: 'Amsterdam',
    },
  },
  images: [],
  type: {
    id: 'SIG',
    label: 'Melding',
  },
  source: 'online',
  email: 'noreply@amsterdam.nl',
  description: 'bomen',
  category: 'openbaar-groen-en-water',
  subcategory: 'overig-groen-en-water',
}
