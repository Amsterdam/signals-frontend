import { Validators } from 'react-reactive-form';
import { some } from 'lodash';

import IncidentNavigation from '../components/IncidentNavigation';

import FormComponents from '../components/IncidentForm/components/';
import PreviewComponents from '../components/IncidentPreview/components/';

import vulaan from './wizard-step-vulaan';

export default {
  beschrijf: {
    label: 'Beschrijf uw melding',
    getNextStep: (wizard, { subcategory }) => {
      if (!some(wizard.vulaan.form.controls, (control) => control.meta && control.meta.ifAllOf && control.meta.ifAllOf.subcategory === subcategory)) {
        return 'incident/telefoon';
      }
      return false;
    },
    form: {
      controls: {
        location: {
          meta: {
            label: 'Waar is het?',
            subtitle: 'Typ de locatie of versleep de markering [dingetje] op de kaart',
            path: 'location',
            watch: true
          },
          options: {
            validators: Validators.required
          },
          render: FormComponents.MapInput
        },
        description: {
          meta: {
            label: 'Waar gaat het om?',
            path: 'text',
            placeholder: 'Beschrijving'
          },
          options: {
            validators: Validators.required
          },
          render: FormComponents.DescriptionWithClassificationInput
        },
        category: {
          meta: {
            label: 'Categorie',
            path: 'category.main',
            type: 'text',
            watch: true
          },
          // options: {
            // validators: Validators.required
          // },
          render: FormComponents.HiddenInput
        },
        subcategory: {
          meta: {
            label: 'Subcategorie',
            path: 'category.sub',
            type: 'text',
            watch: true
          },
          options: {
            validators: Validators.required
          },
          render: FormComponents.HiddenInput
        },
        datetime: {
          meta: {
            cols: 6,
            label: 'Geef het tijdstip aan',
            values: {
              Nu: 'Nu',
              Eerder: 'Eerder'
            },
            updateIncident: true
          },
          options: {
            validators: Validators.required
          },
          render: FormComponents.RadioInput
        },
        incident_date: {
          meta: {
            label: 'Incident date',
            ifAllOf: {
              datetime: 'Eerder'
            },
            watch: true
          },
          render: FormComponents.DateTimeInput,
          strict: false
        },
        incident_time_hours: {
          meta: {
            label: 'Incident time hours',
            readOnly: true,
            watch: true
          },
          render: FormComponents.HiddenInput
        },
        incident_time_minutes: {
          meta: {
            label: 'Incident time minutes',
            readOnly: true,
            watch: true
          },
          render: FormComponents.HiddenInput
        },
        image: {
          meta: {
            label: 'Wilt u een foto meesturen?',
            submitLabel: 'Foto kiezen',
            watch: true
          },
          render: FormComponents.FileInput
        },
        $field_0: {
          isStatic: false,
          render: IncidentNavigation
        }
      }
    }
  },
  vulaan,
  telefoon: {
    label: 'Mogen we u bellen voor vragen?',
    form: {
      controls: {
        phone: {
          meta: {
            label: 'Wat is uw telefoonnummer? (niet verplicht)',
            subtitle: 'Zo kunt u ons helpen het probleem sneller of beter op te lossen.',
            path: 'reporter.phone',
            placeholder: 'Telefoonnummer',
            type: 'text'
          },
          render: FormComponents.TextInput
        },
        privacy_text: {
          meta: {
            cols: 6,
            label: 'Uw privacy',
            type: 'disclaimer',
            value: 'We gebruiken uw telefoonnummer alléén om nog iets te kunnen vragen over uw melding. We wissen uw telefoonnummer binnen 2 weken nadat we uw melding hebben afgehandeld.'
          },
          render: FormComponents.PlainText
        },
        $field_0: {
          isStatic: false,
          render: IncidentNavigation
        }
      }
    }
  },
  email: {
    label: 'Wilt u op de hoogte blijven?',
    form: {
      controls: {
        email: {
          meta: {
            label: 'Wat is uw e-mailadres? (niet verplicht)',
            subtitle: 'We mailen om u te vertellen wat we met uw melding doen. En wanneer het klaar is.',
            path: 'reporter.email',
            placeholder: 'E-mail adres',
            type: 'text'
          },
          options: {
            validators: Validators.email
          },
          render: FormComponents.TextInput
        },
        privacy_text: {
          meta: {
            cols: 6,
            label: 'Uw privacy',
            type: 'disclaimer',
            value: 'We gebruiken uw e-mailadres alléén om u op de hoogte houden, of wanneer wij een vraag hebben en u niet per telefoon kunnen bereiken. We wissen uw e-mailadres er binnen 2 weken nadat we uw melding hebben afgehandeld.'
          },
          render: FormComponents.PlainText
        },
        $field_0: {
          isStatic: false,
          render: IncidentNavigation
        }
      }
    }
  },
  samenvatting: {
    label: 'Controleer uw gegevens',
    subtitle: 'Maak een aanpassing als dat nodig is.',
    form: {
      controls: {
        $field_0: {
          isStatic: false,
          render: IncidentNavigation
        }
      }
    },
    preview: {
      beschrijf: {
        location: {
          label: 'Hier is het',
          render: PreviewComponents.Map
        },
        description: {
          label: 'Hier gaat het om',
          render: PreviewComponents.PlainText
        },
        datetime: {
          label: 'Tijdstip',
          render: PreviewComponents.DateTime
        },
        image: {
          label: 'Foto',
          render: PreviewComponents.Image,
          optional: true
        }
      },
      telefoon: {
        phone: {
          label: 'Uw (mobiele) telefoon',
          render: PreviewComponents.PlainText
        }
      },
      email: {
        email: {
          label: 'Uw e-mailadres',
          render: PreviewComponents.PlainText
        }
      }
    }
  },
  bedankt: {
    label: 'Bedankt!',
    form: {
      controls: {
        text_default: {
          meta: {
            cols: 6,
            label: 'Wat doen we met uw melding?',
            type: 'bedankt',
            ifOneOf: {
              subcategory: [
                // 'Overlast op het water - snel varen',
                // 'Overlast op het water - Gezonken boot',
                // 'Scheepvaart nautisch toezicht',
                // 'Overlast op het water - geluid',
                'Overlast vanaf het water',
                'Overlast op het water - Vaargedrag',
                'Oever / kade / steiger',
                'Veeg- / zwerfvuil',
                'Container is vol',
                'Onderhoud stoep, straat en fietspad',
                'Graffiti / wildplak',
                'Grofvuil',
                'Lozing / dumping / bodemverontreiniging',
                'Straatverlichting / openbare klok',
                'Speelplaats',
                'Huisafval',
                'Hinderlijk geplaatst object',
                'Container is kapot',
                'Onkruid',
                'Auto- / scooter- / bromfiets(wrak)',
                'Vuurwerkoverlast',
                'Prullenbak is vol',
                'Verkeersbord, verkeersafzetting',
                'Container voor plastic afval is vol',
                'Straatmeubilair',
                'Wildplassen / poepen / overgeven',
                'Ratten',
                'Maaien / snoeien',
                'Put / riolering verstopt',
                'Stankoverlast',
                'Verkeersoverlast / Verkeerssituaties',
                'Parkeeroverlast',
                'Fietswrak',
                'Overlast terrassen',
                'Gladheid',
                'Verkeerslicht',
                'Boom',
                'Prullenbak is kapot',
                'Wespen',
                'Daklozen / bedelen',
                'Fietsrek / nietje',
                'Overlast door bezoekers (niet op terras)',
                'Overlast door afsteken vuurwerk',
                'Drijfvuil',
                'Stank- / geluidsoverlast',
                'Puin / sloopafval',
                'Overige overlast door personen',
                'Deelfiets',
                'Bedrijfsafval',
                'Honden(poep)',
                'Omleiding / belijning verkeer',
                'Asbest / accu',
                'Bouw- / sloopoverlast',
                'Drank- en drugsoverlast',
                'Geluidsoverlast installaties',
                'Dode dieren',
                'Jongerenoverlast',
                'Container voor plastic afval is kapot',
                'Duiven',
                'Brug',
                'Geluidsoverlast muziek',
                'Overlast van taxi\'s, bussen en fietstaxi\'s',
                'Sportvoorziening',
                'Meeuwen'
              ]
            },
            value: [
              '[DEFAULT] We geven uw melding door aan onze handhavers. Als dat mogelijk is ondernemen we direct actie. Maar we kunnen niet altijd snel genoeg aanwezig zijn.',
              'Blijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.'
            ]
          },
          render: FormComponents.PlainText
        },
        text_boten_snelheid: {
          meta: {
            cols: 6,
            label: 'Wat doen we met uw melding?',
            type: 'bedankt',
            ifAllOf: {
              subcategory: 'Overlast op het water - snel varen'
            },
            value: [
              'We geven uw melding door aan de handhavers. Als dat mogelijk is ondernemen zij direct actie, maar zij kunnen niet altijd snel genoeg aanwezig zijn.',
              'Blijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.'
            ]
          },
          render: FormComponents.PlainText
        },
        text_boten_geluid: {
          meta: {
            cols: 6,
            label: 'Wat doen we met uw melding?',
            type: 'bedankt',
            ifAllOf: {
              subcategory: 'Overlast op het water - geluid'
            },
            value: [
              'We geven uw melding door aan de handhavers. Als dat mogelijk is ondernemen zij direct actie, maar zij kunnen niet altijd snel genoeg aanwezig zijn.',
              'Blijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.'
            ]
          },
          render: FormComponents.PlainText
        },
        text_boten_gezonken: {
          meta: {
            cols: 6,
            label: 'Wat doen we met uw melding?',
            type: 'bedankt',
            ifAllOf: {
              subcategory: 'Overlast op het water - Gezonken boot'
            },
            value: [
              'We geven uw melding door aan onze handhavers. Zij beoordelen of het nodig is direct actie te ondernemen. Bijvoorbeeld omdat er olie lekt of omdat de situatie gevaar oplevert voor andere boten.',
              'Als er geen directe actie nodig is, dan pakken we uw melding op buiten het vaarseizoen (september - maart).',
              'Bekijk in welke situaties we een wrak weghalen. Boten die vol met water staan, maar nog wél drijven, mogen we bijvoorbeeld niet weghalen.'
            ]
          },
          render: FormComponents.PlainText
        },
        text_scheepvaart_nautisch_toezicht: {
          meta: {
            cols: 6,
            label: 'Wat doen we met uw melding?',
            type: 'bedankt',
            ifAllOf: {
              subcategory: 'Scheepvaart nautisch toezicht'
            },
            value: [
              'We geven uw melding door aan de handhavers. Als dat mogelijk is ondernemen zij direct actie, maar zij kunnen niet altijd snel genoeg aanwezig zijn.',
              'Blijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.'
            ]
          },
          render: FormComponents.PlainText
        }
      }
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
