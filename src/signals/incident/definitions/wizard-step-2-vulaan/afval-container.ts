// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { IconOptions } from 'leaflet'

import configuration from 'shared/services/configuration/configuration'
import { validateObjectLocation } from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'
import { UNREGISTERED_TYPE } from 'signals/incident/components/form/MapSelectors/constants'

export const ICON_SIZE = 40

const options: Partial<IconOptions> = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
}

export const controls = {
  extra_container: {
    meta: {
      language: {
        title: 'Locatie',
        subTitle: 'Kies een container op de kaart',
        unregistered: 'De container staat niet op de kaart',
        unregisteredId: 'Nummer van de container',
        objectTypeSingular: 'container',
        objectTypePlural: 'containers',
        submit: 'Gebruik deze locatie',
        description:
          'Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik "Mijn locatie"',
      },
      label: 'Kies de container waar het om gaat',
      shortLabel: 'Container(s)',
      pathMerge: 'extra_properties',
      wfsFilter:
        '<PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>1</Literal></PropertyIsEqualTo><BBOX><PropertyName>geometrie</PropertyName><gml:Envelope srsName="{srsName}"><lowerCorner>{west} {south}</lowerCorner><upperCorner>{east} {north}</upperCorner></gml:Envelope></BBOX>',
      endpoint: configuration.map.layers.containers,
      maxNumberOfAssets: 5,
      featureTypes: [
        {
          label: 'Restafval',
          description: 'Restafval container',
          icon: {
            options,
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
            options,
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
            options,
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
            options,
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
            options,
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
            options,
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
            options,
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
            iconUrl: '/assets/images/featureUnknownMarker.svg',
          },
          idField: 'id',
          typeField: 'type',
          typeValue: UNREGISTERED_TYPE,
        },
      ],
    },
    render: QuestionFieldType.AssetSelect,
    options: {
      validators: [validateObjectLocation('container')],
    },
  },
}

export default controls
