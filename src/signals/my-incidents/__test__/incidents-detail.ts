import type { MyIncident } from '../types'

export const incidentsList: MyIncident = {
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
}
