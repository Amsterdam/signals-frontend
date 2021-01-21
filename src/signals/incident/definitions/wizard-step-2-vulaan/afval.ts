import type { IconOptions } from 'leaflet';
import { Validators } from 'react-reactive-form';
import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';
import * as afvalIcons from './afval-icons';

export const ICON_SIZE = 40;

const options: Partial<IconOptions> = {
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
      shortLabel: 'Container(s)',
      pathMerge: 'extra_properties',
      postPropertyNames: ['id', 'type', 'description'],
      endpoint: 'https://api.data.amsterdam.nl/v1/wfs/huishoudelijkafval/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=app:container&TYPENAME=app:container&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&outputFormat=application/json;%20subtype=geojson;%20charset=utf-8',
      featureTypes: [
        {
          label: 'Restafval',
          description: 'Restafval container',
          icon: {
            options,
            iconSvg: afvalIcons.rest,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id_nummer',
          typeField: 'fractie_omschrijving',
          typeValue: 'Rest',
        },
        {
          label: 'Papier',
          description: 'Papier container',
          icon: {
            options,
            iconSvg: afvalIcons.paper,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id_nummer',
          typeField: 'fractie_omschrijving',
          typeValue: 'Papier',
        },
        {
          label: 'Glas',
          description: 'Glas container',
          icon: {
            options,
            iconSvg: afvalIcons.glas,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id_nummer',
          typeField: 'fractie_omschrijving',
          typeValue: 'Glas',
        },
        {
          label: 'Plastic',
          description: 'Plastic container',
          icon: {
            options,
            iconSvg: afvalIcons.plastic,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id_nummer',
          typeField: 'fractie_omschrijving',
          typeValue: 'Plastic',
        },
        {
          label: 'Textiel',
          description: 'Textiel container',
          icon: {
            options,
            iconSvg: afvalIcons.textile,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id_nummer',
          typeField: 'fractie_omschrijving',
          typeValue: 'Textiel',
        },
        {
          label: 'Groente- fruit- en tuinafval',
          description: 'Groente- fruit- en tuinafval container',
          icon: {
            options,
            iconSvg: afvalIcons.gft,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id_nummer',
          typeField: 'fractie_omschrijving',
          typeValue: 'GFT',
        },
        {
          label: 'Brood',
          description: 'Brood container',
          icon: {
            options,
            iconSvg: afvalIcons.bread,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id_nummer',
          typeField: 'fractie_omschrijving',
          typeValue: 'Brood',
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
