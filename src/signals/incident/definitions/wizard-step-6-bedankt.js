import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Bedankt!',
  form: {
    controls: {
      text_melding: {
        meta: {
          cols: 6,
          type: 'bedankt',
          value: 'Uw melding is bij ons bekend onder nummer: 666.'
        },
        render: FormComponents.PlainText
      },
      text: {
        meta: {
          cols: 6,
          label: 'Wat doen we met uw melding?',
          type: 'bedankt'
        },
        render: FormComponents.PlainText
      },
      text_A3d_mC: {
        meta: {
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Huisafval',
              'Bedrijfsafval',
              'Puin / sloopafval',
              'Container is vol',
              'Container is kapot',
              'Asbest / accu',
              'Container plastic afval is vol',
              'Container plastic afval is kapot',
              'Lozing / dumping / bodemverontreiniging',
              'Parkeeroverlast',
              'Dode dieren',
              'Overlast door afsteken vuurwerk',
              'Overlast vanaf het water',
              'Overlast van taxi\'s, bussen en fietstaxi\'s',
              'Overige overlast door personen',
              'Jongerenoverlast',
              'Daklozen / bedelen',
              'Wildplassen / poepen / overgeven',
              'Drank- en drugsoverlast'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Veeg- / zwerfvuil',
              'Prullenbak is vol',
              'Onderhoud stoep, straat en fietspad',
              'Verkeersbord, verkeersafzetting'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Grofvuil'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Prullenbak is kapot',
              'Omleiding / belijning verkeer',
              'Brug'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Gladheid'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Straatmeubilair',
              'Fietsrek / nietje',
              'Put / riolering verstopt',
              'Speelplaats',
              'Sportvoorziening',
              'Verkeersoverlast / Verkeerssituaties',
              'Graffiti / wildplak',
              'Hinderlijk geplaatst object',
              'Boom',
              'Maaien / Snoeien',
              'Onkruid',
              'Drijfvuil',
              'Oever / kade / steiger',
              'Ratten',
              'Ganzen',
              'Duiven',
              'Meeuwen',
              'Wespen',
              'Geluidsoverlast muziek',
              'Geluidsoverlast installaties',
              'Overlast terrassen',
              'Stankoverlast',
              'Overlast door bezoekers (niet op terras)'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Straatverlichting / openbare klok'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Verkeerslicht'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Fietswrak',
              'Stank- / geluidsoverlast',
              'Bouw- / sloopoverlast',
              'Auto- / scooter- / bromfiets(wrak)',
              'Honden(poep)',
              'Deelfiets'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Overlast op het water - snel varen',
              'Overlast op het water - geluid'
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
          cols: 6,
          type: 'bedankt',
          ifOneOf: {
            subcategory: [
              'Overlast op het water - Gezonken boot'
            ]
          },
          value: [
            'We geven uw melding door aan onze handhavers. Zij beoordelen of het nodig is direct actie te ondernemen. Bijvoorbeeld omdat er olie lekt of omdat de situatie gevaar oplevert voor andere boten.',
            'Als er geen directe actie nodig is, dan pakken we uw melding op buiten het vaarseizoen (september - maart).',
            'Bekijk in welke situaties we een wrak weghalen. Boten die vol met water staan, maar nog wél drijven, mogen we bijvoorbeeld niet weghalen.'
          ]
        },
        render: FormComponents.PlainText
      }
    }
  }
};
