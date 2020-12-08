import { Validators } from 'react-reactive-form';
import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';
import * as afvalIcons from './afval-icons';

export const ICON_SIZE = 40;

const options = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
};

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
      shortLabel: 'Containers',
      pathMerge: 'extra_properties',
      endpoint: '',
      featureTypes: [
        {
          label: 'Restafval',
          description: 'Restafval container',
          icon: {
            options,
            iconSvg: afvalIcons.rest,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'restafval',
        },
        {
          label: 'Papier',
          description: 'Papier container',
          icon: {
            options,
            iconSvg: afvalIcons.paper,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'papier',
        },
        {
          label: 'Glas',
          description: 'Glas container',
          icon: {
            options,
            iconSvg: afvalIcons.glas,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'glas',
        },
        {
          label: 'Plastic',
          description: 'Plastic container',
          icon: {
            options,
            iconSvg: afvalIcons.plastic,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'plastic',
        },
        {
          label: 'Textiel',
          description: 'Textiel container',
          icon: {
            options,
            iconSvg: afvalIcons.textile,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'textiel',
        },
        {
          label: 'Groente- fruit- en tuinafvaal',
          description: 'Groente- fruit- en tuinafvaal container',
          icon: {
            options,
            iconSvg: afvalIcons.gft,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'gft',
        },
        {
          label: 'Brood',
          description: 'Brood container',
          icon: {
            options,
            iconSvg: afvalIcons.bread,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'brood',
        },
      ],
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
