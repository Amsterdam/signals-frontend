import { Validators } from 'react-reactive-form';

import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

export default {
  controls: {
    custom_text: {
      meta: {
        label: 'Dit hebt u net ingevuld:',
        type: 'citation',
        value: '{incident.description}',
        ignoreVisibility: true
      },
      render: FormComponents.PlainText
    },

    extra_bedrijven_horeca_wat: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        label: 'Uw melding gaat over:',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          horecabedrijf: 'Horecabedrijf, zoals een café, restaurant, snackbar of kantine',
          ander_soort_bedrijf: 'Ander soort bedrijf, zoals een winkel, supermarkt of sportschool',
          evenement_festival_markt: 'Evenement, zoals een festival, feest of markt',
          iets_anders: 'Iets anders'
        }
      },
      options: { validators: [Validators.required] },
      render: FormComponents.RadioInput
    },
    extra_bedrijven_horeca_naam: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Wie of wat zorgt voor deze overlast, denkt u?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_bedrijven_horeca_adres: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Op welk adres ervaart u de overlast?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },

    extra_bedrijven_horeca_muziek_direct_naast: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Woont u direct boven of direct naast het pand waar het geluid vandaan komt?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          naast: 'Naast',
          boven: 'Boven',
          onder: 'Onder',
          nee: 'Nee, ik woon er niet direct naast'
        }
      },
      render: FormComponents.RadioInput
    },

    extra_bedrijven_horeca_muziek_ramen_dicht: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Hebt u ook last van het geluid als uw ramen en deuren gesloten zijn?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, ook last met ramen en deuren gesloten',
          nee: 'Nee, geen last met ramen en deuren gesloten'
        }
      },
      render: FormComponents.RadioInput
    },
    extra_bedrijven_horeca_muziek_ramen_dicht_onderneming: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Staan de ramen of deuren open van de horeca onderneming?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, ramen of deuren staan open',
          nee: 'Nee, ramen en deuren zijn gesloten'
        }
      },
      render: FormComponents.RadioInput
    },
    extra_bedrijven_horeca_muziek_ramen_dicht_onderneming_lang: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
          extra_bedrijven_horeca_muziek_ramen_dicht_onderneming: 'ja'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Gaan de ramen of deuren kort of lang open?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          kort: 'Kort open',
          lang: 'Lang open'
        }
      },
      render: FormComponents.RadioInput
    },

    extra_bedrijven_horeca_muziek_evenement: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Bent u geïnformeerd door de organisator van het evenement?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, ik ben geïnformeerd door de organisator',
          nee: 'Nee, ik ben niet geïnformeerd door de organisator'
        }
      },
      options: { validators: [Validators.required] },
      render: FormComponents.RadioInput
    },

    extra_bedrijven_horeca_muziek_evenement_einde: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
          extra_bedrijven_horeca_wat: 'evenement_festival_markt',
          extra_bedrijven_horeca_muziek_evenement: 'ja'
        },
        label: 'Weet u hoe laat het evenement eindigt?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },

    extra_bedrijven_horeca_installaties: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-installaties'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Van wat voor een soort installatie heeft u last?',
        subtitle: 'Bijvoorbeeld een afzuiger of airconditioning',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },

    extra_bedrijven_horeca_personen: {
      meta: {
        ifAllOf: {
          subcategory: 'overlast-door-bezoekers-niet-op-terras'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Wat is de oorzaak van de overlast?',
        values: {
          dronken_bezoekers: 'Dronken bezoekers',
          schreeuwende_bezoekers: 'Schreeuwende bezoekers',
          rokende_bezoekers: 'Rokende bezoekers',
          teveel_fietsen: '(Teveel) fietsen',
          wildplassen: 'Wildplassen',
          overgeven: 'Overgeven'
        },
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },

    extra_bedrijven_horeca_terrassen: {
      meta: {
        ifAllOf: {
          subcategory: 'overlast-terrassen'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Wat is de oorzaak van de overlast?',
        values: {
          uitgewaaierd_terras: 'Uitgewaaierd terras (buiten de toegestane grens)',
          doorloop: 'Het terras belemmert de doorloop',
          stoep_in_beslag: 'Terras / terrasbezoekers nemen hele stoep in zodat u via de weg erlangs moet',
          bezoekers_op_straat: 'Bezoekers staan op straat',
          bezoekers_op_terras: 'Bezoekers op terras',
          opruimen_meubels: 'Opruimen meubels'
        },
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },

    extra_bedrijven_horeca_stank: {
      meta: {
        ifAllOf: {
          subcategory: 'stankoverlast'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Welke geur ruikt u?',
        subtitle: 'Beschrijf wat voor geur het is',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },

    extra_bedrijven_horeca_stank_oorzaak: {
      meta: {
        ifAllOf: {
          subcategory: 'stankoverlast'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Wat is de vermoedelijke oorzaak van de geuroverlast?',
        subtitle: 'Bijvoorbeeld afvoerpijp of schoorsteen',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },

    extra_bedrijven_horeca_stank_weer: {
      meta: {
        ifAllOf: {
          subcategory: 'stankoverlast'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Wat zijn de weersomstandigheden tijdens de overlast?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },

    extra_bedrijven_horeca_stank_ramen: {
      meta: {
        ifAllOf: {
          subcategory: 'stankoverlast'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Staan de ramen of deuren open van de vermoedelijke veroorzaker?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, ramen of deuren staan open',
          nee: 'Nee, ramen en deuren zijn gesloten'
        }
      },
      render: FormComponents.RadioInput
    },

    extra_bedrijven_horeca_vaker: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Gebeurt het vaker?',
        subtitle: 'Is de overlast vaker aanwezig of is dit een eenmalige gebeurtenis',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, het gebeurt vaker',
          nee: 'Nee, dit is de eerste keer'
        }
      },
      render: FormComponents.RadioInput
    },
    extra_bedrijven_horeca_tijdstippen: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
          extra_bedrijven_horeca_vaker: 'ja'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Op welk(e) tijdstip(pen) ervaart u de overlast?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },

    extra_bedrijven_horeca_muziek_geluidmeting: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'We willen graag een geluidsmeting bij u thuis doen. Mogen we contact met u opnemen om een afspraak te maken?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, u mag contact met mij opnemen',
          nee: 'Nee, liever geen contact'
        }
      },
      render: FormComponents.RadioInput
    },
    extra_bedrijven_horeca_muziek_geluidmeting_caution: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
          extra_bedrijven_horeca_muziek_geluidmeting: 'ja'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        value: 'Let op! Vul uw telefoonnummer in op de volgende pagina',
        className: 'col-sm-12 col-md-8',
        type: 'caution'
      },
      render: FormComponents.PlainText
    },
    extra_bedrijven_horeca_muziek_geluidmeting_ja: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
          extra_bedrijven_horeca_muziek_geluidmeting: 'ja'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'We willen graag een geluidsmeting bij u thuis doen. Mogen we contact met u opnemen om een afspraak te maken?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          within_30_minutes: 'Binnen 30 minuten',
          within_1_hour: 'Binnen 1 uur',
          not_now: 'Niet nu'
        }
      },
      render: FormComponents.RadioInput
    },
    extra_bedrijven_horeca_muziek_geluidmeting_nee: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
          extra_bedrijven_horeca_muziek_geluidmeting: 'nee'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        label: 'Waarom heeft u liever geen contact?',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },

    extra_bedrijven_horeca_caution: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders'
          ]
        },
        value: [
          'Uw gegevens worden vertrouwelijk behandeld en worden niet aan de (horeca)ondernemer of organisator bekend gemaakt.',
          'Anonieme meldingen krijgen een lage prioriteit.'
        ],
        className: 'col-sm-12 col-md-8',
        type: 'caution'
      },
      render: FormComponents.PlainText
    },

    $field_0: {
      isStatic: false,
      render: IncidentNavigation
    }
  }
};
