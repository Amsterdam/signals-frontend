import FormComponents from '../../components/IncidentForm/components/';
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

    extra_bedrijven_binnenstad_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        type: 'caution',
        value: 'Gaat het om overlast in de binnenstad? Bel 14 020 en vul dit formulier niet verder in.  Dan kunnen we sneller voor u aan het werk.'
      },
      render: FormComponents.PlainText
    },
    extra_bedrijven_overig: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        label: 'Uw melding gaat over:',
        pathMerge: 'extra_properties',
        values: {
          Horecabedrijf: 'Horecabedrijf (café, restaurant, snackbar, etc.)',
          'Ander soort bedrijf': 'Ander soort bedrijf',
          Evenement: 'Evenement (festival, markt, etc.)',
          'Iets anders': 'Iets anders'
        }
      },
      render: FormComponents.RadioInput
    },
    extra_bedrijven_naam: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        label: 'Bedrijfsnaam / Evenementnaam van vermoedelijke veroorzaker',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_bedrijven_adres: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        label: 'Op welke locatie ervaart u de overlast',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_bedrijven_vaker: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        label: 'Gebeurt het vaker?',
        pathMerge: 'extra_properties',
        value: 'Ja, het gebeurt vaker:'
      },
      render: FormComponents.CheckboxInput
    },
    extra_bedrijven_momenten: {
      meta: {
        label: 'Geef aan op welke momenten het gebeurt',
        pathMerge: 'extra_properties',
        ifAllOf: {
          extra_bedrijven_vaker: true,
          category: 'overlast-bedrijven-en-horeca'
        }
      },
      render: FormComponents.TextareaInput
    },
    extra_bedrijven_text: {
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca'
        },
        type: 'disclaimer',
        value: [
          'Onze handhavers willen graag contact kunnen opnemen over uw melding. Bijvoorbeeld om een afspraak te maken om bij u thuis een geluidsmeting te verrichten. Anonieme meldingen krijgen daarom een lage prioriteit.',
          'Uw gegevens worden vertrouwelijk behandeld en worden niet aan een (horeca)ondernemer bekend gemaakt.'
        ]
      },
      render: FormComponents.PlainText
    },
    $field_0: {
      isStatic: false,
      render: IncidentNavigation
    }
  }
};
