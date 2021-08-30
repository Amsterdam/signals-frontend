// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import faker from 'faker'
import { StatusCode } from 'signals/incident-management/definitions/statusList'
import type { Incident } from './incident'

// set faker locale
faker.locale = 'nl'

export const mockIncident = (overrides?: Partial<Incident>): Incident => {
  return {
    _links: {
      curies: {
        name: faker.datatype.string(),
        href: faker.internet.url(),
      },
      self: { href: faker.internet.url() },
      archives: { href: faker.internet.url() },
      'sia:attachments': { href: faker.internet.url() },
      'sia:pdf': { href: faker.internet.url() },
      'sia:context': { href: faker.internet.url() },
    },
    _display: faker.datatype.string(),
    category: {
      sub: faker.datatype.string(),
      sub_slug: 'overig-afval',
      main: faker.datatype.string(),
      main_slug: faker.datatype.string(),
      category_url: faker.internet.url(),
      departments: faker.datatype.string(),
      created_by: faker.internet.email(),
      text: null,
      deadline: faker.date.soon().toISOString(),
      deadline_factor_3: faker.date.future().toISOString(),
    },
    id: faker.datatype.number(),
    has_attachments: faker.datatype.boolean(),
    location: {
      id: faker.datatype.number(),
      stadsdeel: 'A',
      buurt_code: null,
      area_type_code: null,
      area_code: null,
      address: {
        postcode: faker.address.zipCode(),
        huisletter: faker.datatype.string(),
        huisnummer: faker.datatype.number(),
        woonplaats: faker.address.city(),
        openbare_ruimte: faker.datatype.string(),
        huisnummer_toevoeging: faker.datatype.string(),
      },
      address_text: faker.address.streetAddress(),
      geometrie: {
        type: 'Point',
        coordinates: [faker.datatype.float(), faker.datatype.float()],
      },
      extra_properties: null,
      created_by: faker.internet.email(),
      bag_validated: faker.datatype.boolean(),
    },
    status: {
      text: faker.datatype.string(),
      user: faker.internet.email(),
      state: StatusCode.Gemeld,
      state_display: faker.datatype.string(),
      target_api: null,
      extra_properties: null,
      send_email: false,
      created_at: faker.date.soon().toISOString(),
    },
    reporter: {
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      sharing_allowed: faker.datatype.boolean(),
    },
    priority: {
      priority: 'normal',
      created_by: faker.internet.email(),
    },
    notes: [],
    type: {
      code: 'SIG',
      created_at: faker.date.past().toISOString(),
      created_by: faker.internet.email(),
    },
    source: faker.datatype.string(),
    text: faker.datatype.string(),
    text_extra: null,
    extra_properties: null,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
    incident_date_start: faker.date.past().toISOString(),
    incident_date_end: null,
    routing_departments: null,
    attachments: [],
    assigned_user_email: null,
    ...overrides,
  }
}
