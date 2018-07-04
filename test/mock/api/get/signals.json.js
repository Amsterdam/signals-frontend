
const signals = [
  {
    _links: {
      self: {
        href: 'https://acc.api.data.amsterdam.nl/signals/auth/signal/6/'
      }
    },
    _display: '6 - i - ij1 - 2018-06-28 11:50:46.031878+00:00',
    id: 6,
    signal_id: '4edb1d0b-c27e-41dd-9227-f96e67ecfe10',
    source: 'bron',
    text: 'Tekst voor melding',
    text_extra: 'Extra text',
    status: {
      id: 4,
      text: 'status2',
      user: 'user@example.com',
      target_api: '',
      state: 'i',
      extern: true,
      extra_properties: {

      }
    },
    location: {
      id: 3,
      stadsdeel: 'N',
      buurt_code: 'ij1',
      address: {
        postcode: '1012JS',
        huisletter: 'A',
        huisnummer: '1',
        woonplaats: 'Amsterdam',
        openbare_ruimte: 'Dam',
        huisnummer_toevoeging: '1'
      },
      address_text: 'Dam 1A-1 1012JS Amsterdam',
      geometrie: {
        type: 'Point',
        coordinates: [
          135.0,
          45.0
        ]
      },
      extra_properties: {

      }
    },
    category: {
      main: 'hoofd',
      sub: 'sub',
      department: 'WaterNet',
      priority: 1
    },
    reporter: {
      email: 'bart@datapunt.nl',
      phone: '1324513435134',
      remove_at: null,
      created_at: '2018-06-28T11:50:46.024550Z',
      updated_at: '2018-06-28T11:50:46.024588Z',
      extra_properties: {

      }
    },
    created_at: '2018-06-28T11:50:46.031878Z',
    updated_at: null,
    incident_date_start: '2018-06-28T11:50:46.031793Z',
    incident_date_end: null,
    operational_date: null,
    image: null,
    upload: null
  },
  {
    _links: {
      self: {
        href: 'https://acc.api.data.amsterdam.nl/signals/auth/signal/5/'
      }
    },
    _display: '5 - m - ABC - 2018-06-27 09:13:15.277401+00:00',
    id: 5,
    signal_id: '9b129116-4da0-4fbe-b0cd-de67ab3d4a63',
    source: 'string',
    text: 'string',
    text_extra: 'string',
    status: {
      id: 2,
      text: 'string',
      user: 'user@example.com',
      target_api: 'string',
      state: 'm',
      extern: true,
      extra_properties: 'string'
    },
    location: {
      id: 2,
      stadsdeel: 'A',
      buurt_code: 'ABC',
      address: {
        postcode: '1012JS',
        huisletter: 'A',
        huisnummer: '1',
        woonplaats: 'Amsterdam',
        openbare_ruimte: 'Dam',
        huisnummer_toevoeging: '1'
      },
      address_text: 'Dam 1A-1 1012JS Amsterdam',
      geometrie: {
        type: 'Point',
        coordinates: [
          135.0,
          45.0
        ]
      },
      extra_properties: {

      }
    },
    category: {
      main: 'string',
      sub: 'string',
      department: 'string',
      priority: 0
    },
    reporter: {
      email: 'user@example.com',
      phone: 'string',
      remove_at: '2018-06-27T06:47:12.423000Z',
      created_at: '2018-06-27T09:13:15.268862Z',
      updated_at: '2018-06-27T09:13:15.268893Z',
      extra_properties: 'string'
    },
    created_at: '2018-06-27T09:13:15.277401Z',
    updated_at: '2018-06-27T06:47:12.423000Z',
    incident_date_start: '2018-06-27T09:13:15.277349Z',
    incident_date_end: '2018-06-27T06:47:12.423000Z',
    operational_date: '2018-06-27T06:47:12.423000Z',
    image: null,
    upload: null
  },
  {
    _links: {
      self: {
        href: 'https://acc.api.data.amsterdam.nl/signals/auth/signal/3/'
      }
    },
    _display: '3 - m - abc - 2018-06-25 15:25:00.319956+00:00',
    id: 3,
    signal_id: 'ebe31c09-a9b6-4872-9570-59e47aa7c69f',
    source: 'string',
    text: 'string',
    text_extra: 'string',
    status: {
      id: 1,
      text: 'string',
      user: 'user@example.com',
      target_api: 'string',
      state: 'm',
      extern: true,
      extra_properties: 'string'
    },
    location: {
      id: 1,
      stadsdeel: 'A',
      buurt_code: 'abc',
      address: '{}',
      address_text: '',
      geometrie: {
        type: 'Point',
        coordinates: [
          135.0,
          45.0
        ]
      },
      extra_properties: 'string'
    },
    category: {
      main: 'string',
      sub: 'string',
      department: 'string',
      priority: 0
    },
    reporter: {
      email: 'user@example.com',
      phone: 'string',
      remove_at: '2018-06-25T15:15:31.936000Z',
      created_at: '2018-06-25T15:25:00.317996Z',
      updated_at: '2018-06-25T15:25:00.318010Z',
      extra_properties: 'string'
    },
    created_at: '2018-06-25T15:25:00.319956Z',
    updated_at: '2018-06-25T15:15:31.936000Z',
    incident_date_start: '2018-06-25T15:25:00.319930Z',
    incident_date_end: '2018-06-25T15:15:31.936000Z',
    operational_date: '2018-06-25T15:15:31.936000Z',
    image: null,
    upload: null
  }
];

const stadsdeel = [
  'Centrum',
  'Noord',
  'West',
  'Nieuw-West',
  'Oost',
  'Zuid',
  'Zuidoost',
  'Geen stadsdeel',
];

const departement = [
  'Waternet',
  'Gemeente'
];

const hoofdrubriek = [
  'Afval',
  'Wegen, verkeer, straatmeubilair',
  'Overlast in de openbare ruimte',
  'Overlast Bedrijven en Horeca',
  'Openbaar groen en water',
  'Overlast van en door personen of groepen',
  'Overlast van dieren',
  'Overlast op het water'
];

const subrubriek = [
  'Veeg- / zwerfvuil',
  'Onderhoud stoep, straat en fietspad',
  'Graffiti / wildplak',
  'Grofvuil',
  'Straatmeubilair',
  'Straatverlichting / openbare klok',
  'Onkruid',
  'Speelplaats',
  'Huisafval',
  'Auto- / scooter- / bromfiets(wrak)',
  'Verkeersbord, verkeersafzetting',
  'Lozing / dumping / bodemverontreiniging',
  'Stank- / geluidsoverlast',
  'Geluidsoverlast muziek',
  'Vuurwerkoverlast',
  'Hinderlijk geplaatst object',
  'Container is vol',
  'Geluidsoverlast installaties',
  'Overige overlast door personen',
  'Stankoverlast',
  'Parkeeroverlast',
  'Container is kapot',
  'Maaien / snoeien',
  'Overlast terrassen',
  'Scheepvaart nautisch toezicht',
  'Prullenbak is vol',
  'Omleiding / belijning verkeer',
  'Put / riolering verstopt',
  'Verkeerslicht',
  'Bouw- / sloopoverlast',
  'Fietswrak',
  'Drank- en drugsoverlast',
  'Puin / sloopafval',
  'Container voor plastic afval is vol',
  'Gladheid',
  'Honden(poep)',
  'Daklozen / bedelen',
  'Bedrijfsafval',
  'Overlast door bezoekers (niet op terras)',
  'Prullenbak is kapot',
  'Drijfvuil',
  'Boom',
  'Wildplassen / poepen / overgeven',
  'Overlast door afsteken vuurwerk',
  'Fietsrek / nietje',
  'Ratten',
  'Oever / kade / steiger',
  'Brug',
  'Verkeersoverlast / Verkeerssituaties',
  'Overlast op het water - snel varen',
  'Overlast op het water - geluid',
  'Overlast op het water - Gezonken boot',
  'Jongerenoverlast',
  'Dode dieren',
  'Deelfiets',
  "Overlast van taxi's, bussen en fietstaxi's",
  'Container voor plastic afval is kapot',
  'Asbest / accu',
  'Wespen',
  'Sportvoorziening',
  'Duiven',
  'Overlast op het water - Vaargedrag',
  'Overlast vanaf het water',
  'Meeuwen'
];

const db = { signals, stadsdeel, departement, hoofdrubriek, subrubriek };

export default db;
