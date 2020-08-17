export const createSignalOverviewMap = () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/signals/v1/public/signals/',
    headers: { 'Content-Type': 'application/json' },
    body: {
      location: {
        geometrie: { type: 'Point', coordinates: [4.89089949, 52.37316397] },
        address: {
          openbare_ruimte: 'Nieuwezijds Voorburgwal',
          huisnummer: '147',
          postcode: '1012RJ',
          woonplaats: 'Amsterdam',
        },
        stadsdeel: 'A',
      },
      category: {
        sub_category: 'http://localhost:8000/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/overig-openbare-ruimte',
      },
      reporter: {},
      incident_date_start: '2020-04-16T14:06:31+02:00',
      text: 'Er staat een paard in de gang, ja ja een paard in de gang.',
    },
  });
};

export const createSignalFilters = () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/signals/v1/public/signals/',
    headers: { 'Content-Type': 'application/json' },
    body: {
      location: {
        geometrie: { type: 'Point', coordinates: [4.74948222, 52.41019044] },
        address: {
          openbare_ruimte: 'Ruigoord',
          huisnummer: '36',
          postcode: '1047HH',
          woonplaats: 'Amsterdam',
        },
        stadsdeel: 'B',
      },
      category: {
        sub_category: 'http://localhost:8000/signals/v1/public/terms/categories/afval/sub_categories/overig-afval',
      },
      reporter: {},
      incident_date_start: '2020-04-21T09:17:15+02:00',
      text: 'We gaan filteren!',
    },
  });
};

export const createPublicSignalForFilters = categoryLink => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/signals/v1/public/signals/',
    headers: { 'Content-Type': 'application/json' },
    body: {
      location: {
        geometrie: { type: 'Point', coordinates: [4.96532009, 52.38251207] },
        address: {
          openbare_ruimte: 'Schellingwouderdijk',
          huisnummer: '317',
          postcode: '1023NK',
          woonplaats: 'Amsterdam',
        },
        stadsdeel: 'N',
      },
      category: {
        sub_category: `${categoryLink}`,
      },
      reporter: {},
      incident_date_start: '2020-04-21T09:17:15+02:00',
      text: 'We gaan filteren!',
    },
  });
};

export const createPrivateSignalForFilters = () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/signals/v1/private/signals/',
    headers: { 'Content-Type': 'application/json' },
    body: {
      priority: { priority: 'high' },
      location: {
        geometrie: { type: 'Point', coordinates: [4.789906644046881, 52.344077006847506] },
        address: {
          openbare_ruimte: 'Madeirapad',
          huisnummer: '13',
          postcode: '1060TE',
          woonplaats: 'Amsterdam',
        },
        stadsdeel: 'F',
      },
      type: { code: 'COM' },
      source: 'Telefoon – Interswitch',
      category: {
        sub_category: 'http://localhost:8000/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/onderhoud-stoep-straat-en-fietspad',
      },
      reporter: { phone: '112', sharing_allowed: true },
      incident_date_start: '2020-07-21T08:41:12+02:00',
      text: 'Laten we dat maar niet zeggen',
      extra_properties: [
        {
          id: 'extra_onderhoud_stoep_straat_en_fietspad',
          label: 'Soort wegdek',
          category_url: '',
          answer: 'nee',
        },
      ],
    },
  });
};

export const createSignalSorting01 = () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/signals/v1/public/signals/',
    headers: { 'Content-Type': 'application/json' },
    body: {
      location: {
        geometrie: { type: 'Point', coordinates: [4.81989868, 52.35713446] },
        address: {
          openbare_ruimte: 'Aaf Bouberstraat',
          huisnummer: '1',
          postcode: '1065LP',
          woonplaats: 'Amsterdam',
        },
        stadsdeel: 'F',
      },
      category: {
        sub_category: 'http://localhost:8000/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-gezonken-boot',
      },
      reporter: {},
      incident_date_start: '2020-04-16T14:06:31+02:00',
      text: 'We gaan sorteren',
    },
  });
};

export const createSignalSorting02 = () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/signals/v1/public/signals/',
    headers: { 'Content-Type': 'application/json' },
    body: {
      location: {
        geometrie: { type: 'Point', coordinates: [5.0001479, 52.34677023] },
        address: {
          openbare_ruimte: 'Zwenkgrasstraat',
          huisnummer: '2',
          postcode: '1087SG',
          woonplaats: 'Amsterdam',
        },
        stadsdeel: 'M',
      },
      category: {
        sub_category: 'http://localhost:8000/signals/v1/public/terms/categories/wonen/sub_categories/woningkwaliteit',
      },
      reporter: {},
      incident_date_start: '2020-04-16T14:06:31+02:00',
      text: 'We gaan veel sorteren',
    },
  });
};
