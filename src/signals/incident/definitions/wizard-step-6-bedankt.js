import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Bedankt!',
  form: {
    controls: {
      text_melding: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          value: 'Uw melding is bij ons bekend onder nummer: {incident.id}.'
        },
        render: FormComponents.PlainText
      },
      text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Wat doen we met uw melding?',
          type: 'bedankt'
        },
        render: FormComponents.PlainText
      },
      text_A3d_mC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'huisafval',
              'bedrijfsafval',
              'puin-sloopafval',
              'container-is-vol',
              'container-is-kapot',
              'asbest-accu',
              'container-voor-plastic-afval-is-vol',
              'container-voor-plastic-afval-is-kapot',
              'lozing-dumping-bodemverontreiniging',
              'parkeeroverlast',
              'dode-dieren',
              'overlast-door-afsteken-vuurwerk',
              'overlast-vanaf-het-water',
              'overlast-van-taxis-bussen-en-fietstaxis',
              'overige-overlast-door-personen',
              'jongerenoverlast',
              'daklozen-bedelen',
              'wildplassen-poepen-overgeven',
              'drank-en-drugsoverlast'
            ]
          },
          value: [
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.',
            'We houden u op de hoogte via e-mail.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_a3d_eC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'veeg-zwerfvuil',
              'prullenbak-is-vol',
              'onderhoud-stoep-straat-en-fietspad',
              'verkeersbord-verkeersafzetting'
            ]
          },
          value: [
            'Wij handelen uw melding binnen drie werkdagen af. U ontvangt dan geen apart bericht meer.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_3d_Evo_mC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'grofvuil'
            ]
          },
          value: [
            'We laten u binnen 3 werkdagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.  In Nieuw-West komen we de volgende ophaaldag.',
            'We houden u op de hoogte via e-mail.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_A3w_eC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'prullenbak-is-kapot',
              'omleiding-belijning-verkeer',
              'brug'
            ]
          },
          value: [
            'Wij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.',
            'En anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_Zsm_gC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'gladheid'
            ]
          },
          value: [
            'Gaat het om gladheid door een ongeluk (olie of frituurvet op de weg)? Dan pakken we uw melding zo snel mogelijk op. In ieder geval binnen 3 werkdagen.',
            'Bij gladheid door sneeuw of bladeren pakken we hoofdwegen en fietsroutes als eerste aan. Andere meldingen behandelen we als de belangrijkste routes zijn gedaan.',
            'U ontvangt geen apart bericht meer over de afhandeling van uw melding.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_I5d_mC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'straatmeubilair',
              'fietsrek-nietje',
              'put-riolering-verstopt',
              'speelplaats',
              'sportvoorziening',
              'verkeersoverlast-verkeerssituaties',
              'graffiti-wildplak',
              'hinderlijk-geplaatst-object',
              'boom',
              'maaien-snoeien',
              'onkruid',
              'drijfvuil',
              'oever-kade-steiger',
              'ratten',
              'ganzen',
              'duiven',
              'meeuwen',
              'wespen',
              'geluidsoverlast-muziek',
              'geluidsoverlast-installaties',
              'overlast-terrassen',
              'stankoverlast',
              'overlast-door-bezoekers-niet-op-terras'
            ]
          },
          value: [
            'Uw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld.',
            'Dat doen we via e-mail.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_Klok_Licht_zC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'straatverlichting-openbare-klok'
            ]
          },
          value: [
            'Gevaarlijke situaties zullen wij zo snel mogelijk verhelpen, andere situaties kunnen wat langer duren. Wij kunnen u hier helaas niet van  op de hoogte houden.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_Stop_eC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'verkeerslicht'
            ]
          },
          value: [
            'Gevaarlijke situaties zullen wij zo snel mogelijk verhelpen, andere situaties handelen wij meestal binnen 5 werkdagen af. U ontvangt dan geen apart bericht meer.',
            'Als we uw melding niet binnen 5 werkdagen kunnen afhandelen, hoort u - via e-mail – hoe wij uw melding oppakken.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_A3w_mC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'fietswrak',
              'stank-geluidsoverlast',
              'bouw-sloopoverlast',
              'auto-scooter-bromfietswrak',
              'hondenpoep',
              'deelfiets'
            ]
          },
          value: [
            'We laten u binnen 3 weken weten wat we hebben gedaan, of dat we meer tijd nodig hebben.',
            'We houden u op de hoogte via e-mail.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_Ws1_eC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'overlast-op-het-water-snel-varen',
              'overlast-op-het-water-geluid'
            ]
          },
          value: [
            'We geven uw melding door aan onze handhavers. Als dat mogelijk is ondernemen we direct actie. Maar we kunnen niet altijd snel genoeg aanwezig zijn.',
            'Blijf overlast aan ons melden. Ook als we niet altijd direct iets voor u kunnen doen. We gebruiken alle meldingen om overlast in de toekomst te kunnen beperken.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_Ws2_eC: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'overlast-op-het-water-gezonken-boot'
            ]
          },
          value: [
            'We geven uw melding door aan onze handhavers. Zij beoordelen of het nodig is direct actie te ondernemen. Bijvoorbeeld omdat er olie lekt of omdat de situatie gevaar oplevert voor andere boten.',
            'Als er geen directe actie nodig is, dan pakken we uw melding op buiten het vaarseizoen (september - maart).',
            'Bekijk in welke situaties we een wrak weghalen. Boten die vol met water staan, maar nog wél drijven, mogen we bijvoorbeeld niet weghalen.'
          ]
        },
        render: FormComponents.PlainText
      },
      text_overig: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'overig'
            ]
          },
          value: [
            'Indien u uw gegevens hebt achtergelaten laten wij u binnen 3 werkdagen weten wat we hebben gedaan. ',
            '',
            'Als u vragen hebt, dan kunt u bellen met 14020 (op werkdagen tussen 08:00 en 18:00 uur).'
          ]
        },
        render: FormComponents.PlainText
      }
    }
  }
};
