import type { MyIncident } from '../types'

export const incidentsList: MyIncident[] = [
  {
    _links: {
      curies: {
        name: 'sia',
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
      },
      self: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/my/signals/a4ed990e-bb4e-4de4-bb5a-f2dd9b907fc4',
      },
    },
    _display: 'SIG-11656',
    uuid: 'a4ed990e-bb4e-4de4-bb5a-f2dd9b907fc4',
    id_display: 'SIG-11656',
    text: 'test',
    status: {
      state: 'CLOSED',
      state_display: 'Afgesloten',
    },
    created_at: '2022-10-10T10:45:45.967617+02:00',
  },
  {
    _links: {
      curies: {
        name: 'sia',
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
      },
      self: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/my/signals/a6d71e6e-a2a8-477b-af85-93c09e4f5877',
      },
    },
    _display: 'SIG-11620',
    uuid: 'a6d71e6e-a2a8-477b-af85-93c09e4f5877',
    id_display: 'SIG-11620',
    text: 'Alles is kapot',
    status: {
      state: 'OPEN',
      state_display: 'Open',
    },
    created_at: '2022-09-27T09:16:00.600480+02:00',
  },
  {
    _links: {
      curies: {
        name: 'sia',
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
      },
      self: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/my/signals/e95e3a15-202c-48a6-8020-e9ad28073e93',
      },
    },
    _display: 'SIG-11607',
    uuid: 'e95e3a15-202c-48a6-8020-e9ad28073e93',
    id_display: 'SIG-11607',
    text: 'Telefoon kapot',
    status: {
      state: 'OPEN',
      state_display: 'Open',
    },
    created_at: '2022-09-19T11:44:50.261491+02:00',
  },
  {
    _links: {
      curies: {
        name: 'sia',
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
      },
      self: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/my/signals/3d48b70e-1c62-4a61-88c1-a8b903d78e7b',
      },
    },
    _display: 'SIG-11577',
    uuid: '3d48b70e-1c62-4a61-88c1-a8b903d78e7b',
    id_display: 'SIG-11577',
    text: 'test',
    status: {
      state: 'OPEN',
      state_display: 'Open',
    },
    created_at: '2022-09-08T15:02:49.051742+02:00',
  },
  {
    _links: {
      curies: {
        name: 'sia',
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
      },
      self: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/my/signals/29ba3606-a037-4e4e-aeb5-d0fe6d1cc3cd',
      },
    },
    _display: 'SIG-11320',
    uuid: '29ba3606-a037-4e4e-aeb5-d0fe6d1cc3cd',
    id_display: 'SIG-11320',
    text: 'Plastic me tuinafval container',
    status: {
      state: 'OPEN',
      state_display: 'Open',
    },
    created_at: '2022-08-15T16:45:04.193754+02:00',
  },
]
