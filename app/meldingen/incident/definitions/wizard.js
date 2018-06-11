export default {
  beschrijf: {
    form: [
      // {
        // type: 'location',
        // name: 'location'
      // },
      {
        type: 'description',
        name: 'description'
      // },
      // {
        // type: 'datetime',
        // name: 'incident_date'
      }
    ]
  },
  // vulaan: {
    // form: {
    // },
    // preview: {
    // }
  // },
  email: {
    form: [{
      type: 'email',
      name: 'reporter.email'
    }]
  },
  telefoon: {
    form: [{
      type: 'phone',
      name: 'reporter.phone'
    }]
  },
  samenvatting: {
    preview: {
      beschrijf: [
        {
          type: 'location',
          name: 'location'
        },
        {
          type: 'description',
          name: 'description'
        },
        {
          type: 'datetime',
          name: 'incident_date'
        }
      ],
      email: [{
        type: 'email',
        name: 'reporter.email'
      }],
      telefoon: [{
        type: 'phone',
        name: 'reporter.phone'
      }]
    }
  // },
  // bedankt: {
    // preview: {
      // bedankt: {}
    // }
  }
};

/*

Stap 1: bechrijf
  waar?
  wat?
  wanneer?

Stap 2: vulaan

Stap 3: email
  email

Stap 4: telefoon
    telefoonnummer

Stap 5: samenvatting
  plaats
  wat
  tijdstip
  [uitgevraagde dingen]
  email
  telefoonnummer

Stap 6: bedankt
  tekst

*/

/*
message:
{
  "description": "Er vaart hier een boot veel te hard",
  "latitude": 52.376,
  "logitude": 4.901,
  "incident_date": "2018-05-19T07:22:15Z",
  "extra_information": "Is een witte boot",
  "reporter": {
    "email": "melder@meldingen.amsterdam.nl",
    "phone": "020-1234567"
  },
  "source": "telefoon",
  "category": "watermelding",
  "subcategory": "overlast",
  "extra_properties": [
    {
      "rederij": "loveboat"
    }
  ]
}
*/
