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
      if (!some(wizard.vulaan.form.controls, (control) => control.meta && control.meta.if && control.meta.if.subcategory === subcategory)) {
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
            readOnly: true,
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
            readOnly: true,
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
            label: 'Geef het tijdstip aan'
          },
          // options: {
          //   validators: Validators.required
          // },
          render: FormComponents.DateTimeInput,
          strict: false
        },
        incident_date: {
          meta: {
            label: 'Incident date',
            readOnly: true,
            watch: true
          },
          options: {
            validators: Validators.required
          },
          render: FormComponents.HiddenInput
        },
        incident_time_hours: {
          meta: {
            label: 'Incident time hours',
            readOnly: true,
            watch: true
          },
          // options: {
            // validators: Validators.required
          // },
          render: FormComponents.HiddenInput
        },
        incident_time_minutes: {
          meta: {
            label: 'Incident time minutes',
            readOnly: true,
            watch: true
          },
          // options: {
            // validators: Validators.required
          // },
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
            placeholder: 'Telefoonnummer',
            type: 'text'
          },
          render: FormComponents.TextInput
        },
        privacy_text: {
          meta: {
            label: 'Uw privacy',
            type: 'privacy',
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
            label: 'Uw privacy',
            type: 'privacy',
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
        incident_date: {
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
