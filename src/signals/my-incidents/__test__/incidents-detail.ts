import type { MyIncident } from '../types'

export const incidentsDetail: MyIncident = {
  _links: {
    curies: {
      name: 'sia',
      href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
    },
    self: {
      href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/my/signals/a4ed990e-bb4e-4de4-bb5a-f2dd9b907fc4',
    },
    'sia:attachments': [{ created_at: '', created_by: '', href: '/' }],
  },
  extra_properties: [
    {
      answer: 'heel erg vaak en het is heel erg stom',
      category_url:
        '/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
      id: 'extra_personen_overig_vaker_momenten',
      label: 'Momenten',
    },
  ],
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
