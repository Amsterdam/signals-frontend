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

    extra_auto_scooter_bromfietswrak: {
      meta: {
        ifAllOf: {
          subcategory:
            'auto-scooter-bromfietswrak'
        },
        label: 'Kunt u nog meer vertellen over het wrak?',
        subheader: 'Bijvoorbeeld: kenteken, merk, kleur, roest, zonder wielen',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_deelfiets: {
      meta: {
        ifAllOf: {
          subcategory:
            'deelfiets'
        },
        label: 'Kunt u nog meer vertellen over deelfiets?',
        subheader: 'Bijvoorbeeld: bedrijf/verhuurder, kleur en nummer',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_fietswrak: {
      meta: {
        ifAllOf: {
          subcategory:
            'fietswrak'
        },
        label: 'Kunt u nog meer vertellen over het fietswrak?',
        subheader: 'Bijvoorbeeld: merk, kleur, roest, zonder wielen',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_parkeeroverlast: {
      meta: {
        ifAllOf: {
          subcategory:
            'parkeeroverlast'
        },
        label: 'Kunt u nog meer vertellen (over de auto, motor, etc)?',
        subheader: 'Bijvoorbeeld: kenteken, merk en kleur',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    $field_0: {
      isStatic: false,
      render: IncidentNavigation
    }
  }
};
