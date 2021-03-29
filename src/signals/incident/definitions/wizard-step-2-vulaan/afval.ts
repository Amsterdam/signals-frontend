import type { IconOptions } from 'leaflet';
import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants';
import * as afvalIcons from './afval-icons';

export const ICON_SIZE = 40;

const options: Partial<IconOptions> = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
};

export const controls = {
  extra_afval: {
    meta: {
      ifOneOf: {
        subcategory: ['grofvuil', 'huisafval', 'puin-sloopafval'],
      },
      label: 'Waar komt het afval vandaan, denkt u?',
      shortLabel: 'Waar vandaan',
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.textarea_input,
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
      wfsFilter: '<PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>1</Literal></PropertyIsEqualTo>',
      endpoint:
        'https://api.data.amsterdam.nl/v1/wfs/huishoudelijkafval/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=app:container&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&outputFormat=application/json',
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
        {
          description: 'De container staat niet op de kaart',
          label: 'Onbekend',
          icon: {
            iconSvg: afvalIcons.unknown,
            selectedIconSvg: afvalIcons.select,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'not-on-map',
        },
      ],
    },
    render: FIELD_TYPE_MAP.container_select,
  },
};

export default controls;
