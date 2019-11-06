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
        ignoreVisibility: true,
      },
      render: FormComponents.PlainText,
    },

    extra_bedrijven_horeca_wat: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
        },
        label: 'Uw melding gaat over:',
        labelShort: 'Soort bedrijf',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          horecabedrijf: 'Horecabedrijf, zoals een café, restaurant, snackbar of kantine',
          ander_soort_bedrijf: 'Ander soort bedrijf, zoals een winkel, supermarkt of sportschool',
          evenement_festival_markt: 'Evenement, zoals een festival, feest of markt',
          iets_anders: 'Iets anders',
        },
      },
      options: { validators: [Validators.required] },
      render: FormComponents.RadioInput,
    },
    extra_bedrijven_horeca_naam: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Wie of wat zorgt voor deze overlast, denkt u?',
        labelShort: 'Mogelijke veroorzaker',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    extra_bedrijven_horeca_adres: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Op welk adres ervaart u de overlast?',
        labelShort: 'Adres overlast',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      options: { validators: [Validators.required] },
      render: FormComponents.TextInput,
    },

    extra_bedrijven_horeca_muziek_direct_naast: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
          ],
        },
        label: 'Woont u direct boven of direct naast het pand waar het geluid vandaan komt?',
        labelShort: 'Aanpandig',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          naast: 'Naast',
          boven: 'Boven',
          onder: 'Onder',
          nee: 'Nee, ik woon er niet direct naast',
        },
      },
      render: FormComponents.RadioInput,
    },

    extra_bedrijven_horeca_muziek_ramen_dicht: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
          ],
        },
        label: 'Hebt u ook last van het geluid als uw ramen en deuren gesloten zijn?',
        labelShort: 'Overlast met ramen en deuren dicht',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, ook last met ramen en deuren gesloten',
          nee: 'Nee, geen last met ramen en deuren gesloten',
        },
      },
      render: FormComponents.RadioInput,
    },
    extra_bedrijven_horeca_muziek_ramen_dicht_onderneming: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
          ],
        },
        label: 'Staan de ramen of deuren open van de horeca onderneming?',
        labelShort: 'Ramen/deuren horeca open',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, ramen of deuren staan open',
          nee: 'Nee, ramen en deuren zijn gesloten',
        },
      },
      render: FormComponents.RadioInput,
    },
    extra_bedrijven_horeca_muziek_ramen_dicht_onderneming_lang: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
          extra_bedrijven_horeca_muziek_ramen_dicht_onderneming: 'ja',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
          ],
        },
        label: 'Gaan de ramen of deuren kort of lang open?',
        labelShort: 'Ramen/deuren gaan',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          kort: 'Kort open',
          lang: 'Lang open',
        },
      },
      render: FormComponents.RadioInput,
    },

    extra_bedrijven_horeca_muziek_evenement: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
          extra_bedrijven_horeca_wat: 'evenement_festival_markt',
        },
        label: 'Bent u geïnformeerd door de organisator van het evenement?',
        labelShort: 'Geïnformeerd door organisator',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, ik ben geïnformeerd door de organisator',
          nee: 'Nee, ik ben niet geïnformeerd door de organisator',
        },
      },
      options: { validators: [Validators.required] },
      render: FormComponents.RadioInput,
    },

    extra_bedrijven_horeca_muziek_evenement_einde: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
          extra_bedrijven_horeca_wat: 'evenement_festival_markt',
          extra_bedrijven_horeca_muziek_evenement: 'ja',
        },
        label: 'Weet u hoe laat het evenement eindigt?',
        labelShort: 'Evenement eindigt om',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      options: { validators: [Validators.required] },
      render: FormComponents.TextInput,
    },

    extra_bedrijven_horeca_installaties: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-installaties',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Van wat voor een soort installatie heeft u last?',
        labelShort: 'Soort installatie',
        subtitle: 'Bijvoorbeeld een afzuiger of airconditioning',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      options: { validators: [Validators.required] },
      render: FormComponents.TextInput,
    },

    extra_bedrijven_horeca_personen: {
      meta: {
        ifAllOf: {
          subcategory: 'overlast-door-bezoekers-niet-op-terras',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Wat is de oorzaak van de overlast?',
        labelShort: 'Oorzaak overlast',
        values: {
          dronken_bezoekers: 'Dronken bezoekers',
          schreeuwende_bezoekers: 'Schreeuwende bezoekers',
          rokende_bezoekers: 'Rokende bezoekers',
          teveel_fietsen: '(Teveel) fietsen',
          wildplassen: 'Wildplassen',
          overgeven: 'Overgeven',
        },
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.CheckboxInput,
    },

    extra_bedrijven_horeca_terrassen: {
      meta: {
        ifAllOf: {
          subcategory: 'overlast-terrassen',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Wat is de oorzaak van de overlast?',
        labelShort: 'Oorzaak overlast',
        values: {
          uitgewaaierd_terras: 'Uitgewaaierd terras (buiten de toegestane grens)',
          doorloop: 'Het terras belemmert de doorloop',
          stoep_in_beslag: 'Terras / terrasbezoekers nemen hele stoep in zodat u via de weg erlangs moet',
          bezoekers_op_straat: 'Bezoekers staan op straat',
          bezoekers_op_terras: 'Bezoekers op terras',
          opruimen_meubels: 'Opruimen meubels',
        },
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.CheckboxInput,
    },

    extra_bedrijven_horeca_stank: {
      meta: {
        ifAllOf: {
          subcategory: 'stankoverlast',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Welke geur ruikt u?',
        labelShort: 'Soort geur',
        subtitle: 'Beschrijf wat voor geur het is',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },

    extra_bedrijven_horeca_stank_oorzaak: {
      meta: {
        ifAllOf: {
          subcategory: 'stankoverlast',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Wat is de vermoedelijke oorzaak van de geuroverlast?',
        labelShort: 'Vermoedelijke oorzaak',
        subtitle: 'Bijvoorbeeld afvoerpijp of schoorsteen',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },

    extra_bedrijven_horeca_stank_weer: {
      meta: {
        ifAllOf: {
          subcategory: 'stankoverlast',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Wat zijn de weersomstandigheden tijdens de overlast?',
        labelShort: 'Weersomstandigheden',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },

    extra_bedrijven_horeca_stank_ramen: {
      meta: {
        ifAllOf: {
          subcategory: 'stankoverlast',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Staan de ramen of deuren open van de vermoedelijke veroorzaker?',
        labelShort: 'Ramen/deuren open',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, ramen of deuren staan open',
          nee: 'Nee, ramen en deuren zijn gesloten',
        },
      },
      render: FormComponents.RadioInput,
    },

    extra_bedrijven_horeca_vaker: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Gebeurt het vaker?',
        labelShort: 'Vaker overlast',
        subtitle: 'Is de overlast vaker aanwezig of is dit een eenmalige gebeurtenis',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, het gebeurt vaker',
          nee: 'Nee, dit is de eerste keer',
        },
      },
      render: FormComponents.RadioInput,
    },
    extra_bedrijven_horeca_tijdstippen: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
          extra_bedrijven_horeca_vaker: 'ja',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Op welk(e) tijdstip(pen) ervaart u de overlast?',
        labelShort: 'Overlast momenten',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },

    extra_bedrijven_horeca_muziek_geluidmeting_muziek: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-muziek',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Mogen we contact met u opnemen over de melding?',
        subtitle: 'Bijvoorbeeld om bij u thuis een geluidsmeting te doen?',
        labelShort: 'Toestemming contact opnemen',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, u mag contact met mij opnemen',
          nee: 'Nee, liever geen contact',
        },
      },
      options: { validators: [Validators.required] },
      render: FormComponents.RadioInput,
    },
    extra_bedrijven_horeca_muziek_geluidmeting_installaties: {
      meta: {
        ifAllOf: {
          subcategory: 'geluidsoverlast-installaties',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Mogen we contact met u opnemen over de melding?',
        subtitle: 'Bijvoorbeeld om bij u thuis een geluidsmeting te doen?',
        labelShort: 'Toestemming contact opnemen',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, u mag contact met mij opnemen',
          nee: 'Nee, liever geen contact',
        },
      },
      options: { validators: [Validators.required] },
      render: FormComponents.RadioInput,
    },
    extra_bedrijven_horeca_muziek_geluidmeting_overige: {
      meta: {
        ifAllOf: {
          subcategory: 'overig-horecabedrijven',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        label: 'Mogen we contact met u opnemen over de melding?',
        subtitle: 'Bijvoorbeeld om bij u thuis een geluidsmeting te doen?',
        labelShort: 'Toestemming contact opnemen',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, u mag contact met mij opnemen',
          nee: 'Nee, liever geen contact',
        },
      },
      options: { validators: [Validators.required] },
      render: FormComponents.RadioInput,
    },
    extra_bedrijven_horeca_muziek_geluidmeting_caution: {
      meta: {
        ifOneOf: {
          extra_bedrijven_horeca_muziek_geluidmeting_muziek: 'ja',
          extra_bedrijven_horeca_muziek_geluidmeting_installaties: 'ja',
          extra_bedrijven_horeca_muziek_geluidmeting_overige: 'ja',
        },
        value: 'Let op! Vul uw telefoonnummer in op de volgende pagina',
        className: 'col-sm-12 col-md-8',
        type: 'caution',
      },
      render: FormComponents.PlainText,
    },
    extra_bedrijven_horeca_muziek_geluidmeting_ja: {
      meta: {
        ifOneOf: {
          extra_bedrijven_horeca_muziek_geluidmeting_muziek: 'ja',
          extra_bedrijven_horeca_muziek_geluidmeting_installaties: 'ja',
          extra_bedrijven_horeca_muziek_geluidmeting_overige: 'ja',
        },
        label: 'Mogen we u nu bellen?',
        labelShort: 'Bel moment',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
        values: {
          within_30_minutes: 'Binnen 30 minuten',
          within_1_hour: 'Binnen 1 uur',
          not_now: 'Niet nu',
        },
      },
      render: FormComponents.RadioInput,
    },
    extra_bedrijven_horeca_muziek_geluidmeting_ja_nietnu: {
      meta: {
        ifOneOf: {
          extra_bedrijven_horeca_muziek_geluidmeting_ja: 'not_now',
        },
        label: 'Wanneer mogen we u bellen?',
        labelShort: 'Ander bel moment',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    extra_bedrijven_horeca_muziek_geluidmeting_nee: {
      meta: {
        ifOneOf: {
          extra_bedrijven_horeca_muziek_geluidmeting_muziek: 'nee',
          extra_bedrijven_horeca_muziek_geluidmeting_installaties: 'nee',
          extra_bedrijven_horeca_muziek_geluidmeting_overige: 'nee',
        },
        label: 'Waarom heeft u liever geen contact?',
        labelShort: 'Liever geen contact',
        className: 'col-sm-12 col-md-8',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },

    extra_bedrijven_horeca_caution: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
        },
        ifOneOf: {
          extra_bedrijven_horeca_wat: [
            'horecabedrijf',
            'ander_soort_bedrijf',
            'evenement_festival_markt',
            'iets_anders',
          ],
        },
        value: [
          'Uw gegevens worden vertrouwelijk behandeld en worden niet aan de (horeca)ondernemer of organisator bekend gemaakt.',
          'Anonieme meldingen krijgen een lage prioriteit.',
        ],
        className: 'col-sm-12 col-md-8',
        type: 'caution',
      },
      render: FormComponents.PlainText,
    },

    $field_0: {
      isStatic: false,
      render: IncidentNavigation,
    },
  },
};
