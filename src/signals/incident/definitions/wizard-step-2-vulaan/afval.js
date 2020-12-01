import { Validators } from 'react-reactive-form';
import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

const intro = {
  custom_text: {
    meta: {
      label: 'Dit hebt u net ingevuld:',
      type: 'citation',
      value: '{incident.description}',
      ignoreVisibility: true,
    },
    render: FormComponents.PlainText,
  },
};

export const controls = {
  extra_afval: {
    meta: {
      ifOneOf: {
        subcategory: ['grofvuil', 'huisafval', 'puin-sloopafval'],
      },
      label: 'Heeft u een vermoeden waar het afval vandaan komt?',
      shortLabel: 'Waar vandaan',
      pathMerge: 'extra_properties',
    },
    render: FormComponents.TextareaInput,
  },
  extra_container: {
    meta: {
      ifOneOf: {
        subcategory: [
          'container-glas-kapot',
          'container-glas-vol',
          'container-is-kapot',
          'container-is-vol',
          'container-voor-papier-is-stuk',
          'container-voor-papier-is-vol',
          'container-voor-plastic-afval-is-vol',
          'container-voor-plastic-afval-is-kapot',
        ],
      },
      label: 'Kies de container waar het om gaat',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: [Validators.required],
    },
    render: FormComponents.ContainerSelectRenderer,
  },
};

const navigation = {
  $field_0: {
    isStatic: false,
    render: IncidentNavigation,
  },
};

export default {
  controls: {
    ...intro,

    ...controls,

    ...navigation,
  },
};
