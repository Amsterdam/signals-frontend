export default {
  beschrijf: {
    form: {
      location: {},
      description: {},
      incident_date: {}
    },
    preview: {

    }
  },
  vulaan: {
    form: {
    },
    preview: {
    }
  },
  email: {
    form: {
      'reporter.email': {}
    }
  },
  telefoon: {
    form: {
      'reporter.phone': {}
    }
  },
  samenvatting: {
    preview: {
      beschrijf: {
        location: {},
        description: {},
        incident_date: {}
      },
      email: {
        'reporter.email': {}
      },
      telefoon: {
        'reporter.phone': {}
      }
    }
  },
  bedankt: {
    preview: {
      bedankt: {}
    }
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
