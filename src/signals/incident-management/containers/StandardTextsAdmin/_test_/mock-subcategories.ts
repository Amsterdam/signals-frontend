export const mockSubcategory = [
  {
    public_name: 'Afval',
    departments: [
      {
        id: 6,
        code: 'ASC',
        name: 'Actie Service Centrum',
        is_intern: true,
        is_responsible: true,
        can_view: true,
      },
      {
        id: 20,
        code: 'AB',
        name: 'Amsterdamse Bos',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 4,
        code: 'STW',
        name: 'Stadswerken',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 22,
        code: 'MRB',
        name: 'Marktbureau',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 2,
        code: 'THO',
        name: 'THOR',
        is_intern: true,
        is_responsible: true,
        can_view: true,
      },
      {
        id: 12,
        code: 'CCA',
        name: 'CCA',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 24,
        code: 'STD',
        name: 'Stadsdelen',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 23,
        code: 'VTH',
        name: 'VTH',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 21,
        code: 'PRK',
        name: 'Parkeren',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
    ],
    _display:
      'Overige overlast door personen (Overlast van en door personen of groepen)',
    fk: '4',
    sla: {
      n_days: 3,
      use_calendar_days: false,
    },
    name: 'Overige overlast door personen',
    slug: 'overige-overlast-door-personen',
    handling_message:
      'Wij bekijken uw melding en zorgen dat het juiste onderdeel van de gemeente deze gaat behandelen. Heeft u contactgegevens achtergelaten? Dan nemen wij bij onduidelijkheid contact met u op.',
    value: 'Overige overlast door personen',
    note: null,
    parentKey:
      'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen',
    configuration: null,
    is_public_accessible: false,
    _links: {
      curies: {
        name: 'sia',
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
      },
      self: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/55',
        public:
          'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
      },
      archives: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/55/history',
      },
      'sia:status-message-templates': {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen/status-message-templates',
      },
      'sia:parent': {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/84',
        public:
          'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen',
      },
    },
    id: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
    is_active: true,
    description: null,
    key: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
    extendedName: 'Overige overlast door personen (ASC, THO)',
    category_slug: 'overlast-van-en-door-personen-of-groepen',
  },
  {
    public_name: 'Overlast',
    departments: [
      {
        id: 6,
        code: 'ASC',
        name: 'Actie Service Centrum',
        is_intern: true,
        is_responsible: true,
        can_view: true,
      },
      {
        id: 20,
        code: 'AB',
        name: 'Amsterdamse Bos',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 4,
        code: 'STW',
        name: 'Stadswerken',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 22,
        code: 'MRB',
        name: 'Marktbureau',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 2,
        code: 'THO',
        name: 'THOR',
        is_intern: true,
        is_responsible: true,
        can_view: true,
      },
      {
        id: 12,
        code: 'CCA',
        name: 'CCA',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 24,
        code: 'STD',
        name: 'Stadsdelen',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 23,
        code: 'VTH',
        name: 'VTH',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 21,
        code: 'PRK',
        name: 'Parkeren',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 9,
        code: 'VOR',
        name: 'V&OR',
        is_intern: true,
        is_responsible: true,
        can_view: true,
      },
    ],
    _display: 'Parkeeroverlast (Overlast in de openbare ruimte)',
    fk: '79',
    sla: {
      n_days: 3,
      use_calendar_days: false,
    },
    name: 'Parkeeroverlast',
    slug: 'parkeeroverlast',
    handling_message:
      'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
    value: 'Parkeeroverlast',
    note: null,
    parentKey:
      'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte',
    configuration: null,
    is_public_accessible: false,
    _links: {
      curies: {
        name: 'sia',
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
      },
      self: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/30',
        public:
          'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast',
      },
      archives: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/30/history',
      },
      'sia:status-message-templates': {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast/status-message-templates',
      },
      'sia:parent': {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/81',
        public:
          'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte',
      },
    },
    id: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast',
    is_active: true,
    description: null,
    key: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast',
    extendedName: 'Parkeeroverlast (ASC, THO, VOR)',
    category_slug: 'overlast-in-de-openbare-ruimte',
  },
  {
    public_name: 'Eikenprocessierups',
    departments: [
      {
        id: 6,
        code: 'ASC',
        name: 'Actie Service Centrum',
        is_intern: true,
        is_responsible: true,
        can_view: true,
      },
      {
        id: 20,
        code: 'AB',
        name: 'Amsterdamse Bos',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 4,
        code: 'STW',
        name: 'Stadswerken',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 22,
        code: 'MRB',
        name: 'Marktbureau',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 2,
        code: 'THO',
        name: 'THOR',
        is_intern: true,
        is_responsible: true,
        can_view: true,
      },
      {
        id: 12,
        code: 'CCA',
        name: 'CCA',
        is_intern: true,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 24,
        code: 'STD',
        name: 'Stadsdelen',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 23,
        code: 'VTH',
        name: 'VTH',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 21,
        code: 'PRK',
        name: 'Parkeren',
        is_intern: false,
        is_responsible: false,
        can_view: true,
      },
      {
        id: 9,
        code: 'VOR',
        name: 'V&OR',
        is_intern: true,
        is_responsible: true,
        can_view: true,
      },
    ],
    _display: 'Parkeeroverlast (Overlast in de openbare ruimte)',
    fk: '5',
    sla: {
      n_days: 3,
      use_calendar_days: false,
    },
    name: 'Parkeeroverlast',
    slug: 'parkeeroverlast',
    handling_message:
      'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
    value: 'Parkeeroverlast',
    note: null,
    parentKey:
      'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte',
    configuration: null,
    is_public_accessible: false,
    _links: {
      curies: {
        name: 'sia',
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/relations',
      },
      self: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/30',
        public:
          'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast',
      },
      archives: {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/30/history',
      },
      'sia:status-message-templates': {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast/status-message-templates',
      },
      'sia:parent': {
        href: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/private/categories/81',
        public:
          'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte',
      },
    },
    id: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast',
    is_active: true,
    description: null,
    key: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/parkeeroverlast',
    extendedName: 'Parkeeroverlast (ASC, THO, VOR)',
    category_slug: 'overlast-in-de-openbare-ruimte',
  },
]
