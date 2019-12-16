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

    extra_auto_scooter_bromfietswrak: {
      meta: {
        ifAllOf: {
          subcategory:
            'auto-scooter-bromfietswrak',
        },
        label: 'Zijn er nog meer dingen die u ons kunt vertellen over hoe het wrak eruit ziet en de plek waar het ligt?',
        subheader: 'Bijvoorbeeld: kenteken, merk, kleur, roest, zonder wielen',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    extra_fietswrak: {
      meta: {
        ifAllOf: {
          subcategory:
            'fietswrak',
        },
        label: 'Zijn er nog meer dingen die u ons kunt vertellen over hoe het wrak eruit ziet en de plek waar het ligt?',
        subtitle: 'Bijvoorbeeld: merk, kleur, roest, zonder wielen',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    extra_parkeeroverlast: {
      meta: {
        ifAllOf: {
          subcategory:
            'parkeeroverlast',
        },
        label: 'Zijn er nog meer dingen die u ons kunt vertellen over de kenmerken van de auto, bus of motor?',
        subheader: 'Bijvoorbeeld: kenteken, merk en kleur',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    $field_0: {
      isStatic: false,
      render: IncidentNavigation,
    },
  },
};
