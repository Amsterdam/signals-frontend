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

    extra_wonen_woningdelen_vermoeden: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
          ],
        },
        label: 'Weet u wat zich in deze woning afspeelt?',
        subtitle: 'Vermoedens over bijvoorbeeld illegale activiteiten',
        shortLabel: 'Vermoeden',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-6',
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_woningdelen_eigenaar: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
          ],
        },
        label: 'Weet u wie de eigenaar is van de woning?',
        shortLabel: 'Eigenaar',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-6',
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_woningdelen_adres_huurder: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
          ],
        },
        label: 'Weet u waar de officiële huurder woont?',
        subtitle: 'De persoon die in de woning zou moeten wonen',
        shortLabel: 'Adres huurder',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-6',
        values: {
          zelfde_adres: 'Op het zelfde adres als de bewoners',
          ander_adres: 'Op een ander adres dan de bewoners',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },


    extra_wonen_aantal_personen: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
          ],
        },
        label: 'Hoeveel personen wonen er op dit adres?',
        shortLabel: 'Aantal personen',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-6',
        values: {
          een_persoon: '1 persoon',
          twee_personen: '2 personen',
          drie_personen: '3 personen',
          vier_personen: '4 personen',
          vijf_of_meer_personen: '5 of meer  personen',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_bewoners_familie: {
      meta: {
        ifAllOf: {
          subcategory: 'woningdelen',
        },
        ifOneOf: {
          extra_wonen_aantal_personen: [
            'drie_personen',
            'vier_personen',
            'vijf_of_meer_personen',
          ],
        },
        label: 'Zijn de bewoners familie van elkaar?',
        shortLabel: 'Bewoners familie',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-6',
        values: {
          ja: 'Ja, de bewoners zijn familie',
          nee: 'Nee, de bewoners zijn geen familie',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },


    extra_wonen_woningdelen_samenwonen: {
      meta: {
        ifAllOf: {
          subcategory: 'woningdelen',
        },
        ifOneOf: {
          extra_wonen_aantal_personen: [
            'drie_personen',
            'vier_personen',
            'vijf_of_meer_personen',
          ],
        },
        label: 'Zijn de personen samen op het adres komen wonen?',
        shortLabel: 'Samenwonen',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-6',
        values: {
          ja: 'Ja, ze zijn samen op het adres komen wonen',
          nee: 'Nee, ze zijn op verschillende momenten op het adres komen wonen',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woningdelen_wisselende_bewoners: {
      meta: {
        ifAllOf: {
          subcategory: 'woningdelen',
        },
        label: 'Komen er vaak nieuwe bewoners op het adres wonen?',
        shortLabel: 'Wisselende bewoners',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-6',
        values: {
          ja: 'Ja, vaak wisselende bewoners op het adres',
          nee: 'Nee, dezelfde bewoners',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woningdelen_iemand_aanwezig: {
      meta: {
        ifAllOf: {
          subcategory: 'woningdelen',
        },
        label: 'Op welke dag/tijd is er iemand op het adres?',
        shortLabel: 'Iemand aanwezig',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-6',
      },
      render: FormComponents.TextInput,
    },

    $field_0: {
      isStatic: false,
      render: IncidentNavigation,
    },
  },
}