import FormComponents from '../components/IncidentForm/components/';

export default {
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
};
