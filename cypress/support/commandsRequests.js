export const createSignalOverviewMap = () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/signals/v1/public/signals/',
    headers: { 'Content-Type': 'application/json' },
    body: {
      "location": {
        "geometrie": { "type": "Point", "coordinates": [4.89089949, 52.37316397] },
        "address": {
          "openbare_ruimte": "Nieuwezijds Voorburgwal",
          "huisnummer": "147",
          "postcode": "1012RJ",
          "woonplaats": "Amsterdam",
        },
        "stadsdeel": "A",
      },
      "category": {
        "sub_category": "http://localhost:8000/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/overig-openbare-ruimte",
      },
      "reporter": {},
      "incident_date_start": "2020-04-16T14:06:31+02:00",
      "text": "Er staat een paard in de gang, ja ja een paard in de gang.",
    },
  });
};

export const createSignalFilters = () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/signals/v1/public/signals/',
    headers: { 'Content-Type': 'application/json' },
    body: {
      "location": {
        "geometrie": { "type": "Point", "coordinates": [4.74948222, 52.41019044] },
        "address": {
          "openbare_ruimte": "Ruigoord",
          "huisnummer": "36",
          "postcode": "1047HH",
          "woonplaats": "Amsterdam",
        },
        "stadsdeel": "B",
      },
      "category": {
        "sub_category": "http://localhost:8000/signals/v1/public/terms/categories/afval/sub_categories/overig-afval",
      },
      "reporter": {},
      "incident_date_start": "2020-04-21T09:17:15+02:00",
      "text": "We gaan filteren!",
    },
  });
};