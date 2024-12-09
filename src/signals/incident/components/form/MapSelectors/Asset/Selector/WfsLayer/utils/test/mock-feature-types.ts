// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { FeatureType } from '../../../../../types'

export const mockContainerFeatureTypes: FeatureType[] = [
  {
    label: 'Restafval',
    description: 'Restafval container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/rest.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Rest',
  },
  {
    label: 'Papier',
    description: 'Papier container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/paper.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Papier',
  },
  {
    label: 'Glas',
    description: 'Glas container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/glas.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Glas',
  },
  {
    label: 'Plastic',
    description: 'Plastic container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/plastic.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Plastic',
  },
  {
    label: 'Textiel',
    description: 'Textiel container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/textile.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Textiel',
  },
  {
    label: 'Groente- fruit- en tuinafval',
    description: 'Groente- fruit- en tuinafval container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/gft.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'GFT',
  },
  {
    label: 'Brood',
    description: 'Brood container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/bread.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Brood',
  },
  {
    description: 'De container staat niet op de kaart',
    label: 'Onbekend',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/feature-unknown-marker.svg',
    },
    idField: 'id',
    typeField: 'type',
    typeValue: 'not-on-map',
  },
]

export const mockPublicLightsFeatureTypes: FeatureType[] = [
  {
    label: 'Grachtmast',
    description: 'Grachtmast',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/openbare_verlichting/grachtmast.svg',
    },
    idField: 'objectnummer',
    typeField: 'objecttype',
    typeValue: '5',
  },
  {
    label: 'Overspanning',
    description: 'Overspanning',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/openbare_verlichting/overspanning.svg',
    },
    idField: 'objectnummer',
    typeField: 'objecttype',
    typeValue: '2',
  },
  {
    label: 'Gevelarmatuur',
    description: 'Gevelarmatuur',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/openbare_verlichting/gevelarmatuur.svg',
    },
    idField: 'objectnummer',
    typeField: 'objecttype',
    typeValue: '3',
  },
  {
    label: 'Schijnwerper',
    description: 'Schijnwerper',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/openbare_verlichting/schijnwerper.svg',
    },
    idField: 'objectnummer',
    typeField: 'objecttype',
    typeValue: '10',
  },
  {
    label: 'Overig lichtpunt',
    description: 'Overig lichtpunt',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/openbare_verlichting/overig.svg',
    },
    idField: 'objectnummer',
    typeField: 'objecttype',
    typeValue: '4',
  },
  {
    description: 'Het lichtpunt staat niet op de kaart',
    label: 'Onbekend',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/feature-unknown-marker.svg',
    },
    idField: 'id',
    typeField: 'type',
    typeValue: 'not-on-map',
  },
]

export const mockCaterpillarFeatureTypes: FeatureType[] = [
  {
    label: 'Eikenboom',
    description: 'Eikenboom',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/groen_water/tree.svg',
    },
    idField: 'id',
    typeValue: 'Eikenboom',
    typeField: 'type',
  },
  {
    idField: 'UNKNOWN',
    label: 'Onbekend',
    description: 'De boom staat niet op de kaart',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/feature-unknown-marker.svg',
    },
    typeValue: 'not-on-map',
    typeField: '',
  },
]

export const mockPublicLightsFeatureTypesDenHaag = [
  {
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/openbare_verlichting/overig.svg',
    },
    label: 'Straatverlichting',
    idField: 'LumiId',
    description: 'Lichtpunt {{ MastCode }} ',
  },
]
