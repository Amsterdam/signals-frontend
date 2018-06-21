
const signals = [
  {
    _display: 'Signal object (1)',
    signal_id: '4add4b92-5627-4a06-8f11-a5b4985e5170',
    created_at: '2018-06-12T12:07:49.227979Z',
    id: 1,
    melding_id: 124,
    location: {
      latitude: 52.376,
      logitude: 4.901,
      stadsdeel: 'Centrum'
    },
    current_state: {
      state: 'Gemeld',
      description: 'Verblijfsobject in gebruik'
    },
    department: 'Waternet',
    category: 'watermelding',
    subcategory: 'overlast',
    incident_date: '2018-05-19T07:22:15Z'
  },
  {
    _display: 'Signal object (2)',
    signal_id: 'a5b4985e5170-5627-4a06-8f11-a5b4985e5170',
    created_at: '2018-06-10T12:02:02Z',
    id: 2,
    melding_id: 125,
    location: {
      latitude: 52.366,
      logitude: 4.911,
      stadsdeel: 'Oost'
    },
    current_state: {
      state: 'Gemeld',
      description: 'Verblijfsobject in gebruik'
    },
    department: 'Waternet',
    category: 'watermelding',
    subcategory: 'overlast',
    incident_date: '2018-05-19T07:22:15Z'
  },
  {
    _display: 'Signal object (3)',
    signal_id: 'a5b4985e5170-5627-4a06-8f11-a5b4985e5170',
    created_at: '2018-06-10T12:02:02Z',
    id: 2,
    melding_id: 125,
    location: {
      latitude: 52.356,
      logitude: 4.921,
      stadsdeel: 'West'
    },
    current_state: {
      state: 'Gemeld',
      description: 'Verblijfsobject in gebruik'
    },
    department: 'Waternet',
    category: 'geluid',
    subcategory: 'overlast',
    incident_date: '2018-05-19T07:22:15Z'
  },
  {
    _display: 'Signal object (4)',
    signal_id: 'a5b4985e5170-5627-4a06-8f11-a5b4985e5170',
    created_at: '2018-06-10T12:02:02Z',
    id: 2,
    melding_id: 125,
    location: {
      latitude: 52.356,
      logitude: 4.921,
      stadsdeel: 'West'
    },
    current_state: {
      state: 'Gemeld',
      description: 'Verblijfsobject in gebruik'
    },
    department: 'Waternet',
    category: 'geluid',
    subcategory: 'overlast',
    incident_date: '2018-05-19T07:22:15Z'
  },
];

const stadsdeel = [
  'Centrum',
  'Oost',
  'Noord'
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
