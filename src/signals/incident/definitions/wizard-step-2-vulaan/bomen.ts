// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { IconOptions } from 'leaflet'

import { UNREGISTERED_TYPE } from 'signals/incident/components/form/MapSelectors/constants'
import { QuestionFieldType } from 'types/question'

import type ConfigurationType from '../../../../../app.amsterdam.json'
import appConfiguration from '../../../../shared/services/configuration/configuration'
import { validateObjectLocation } from '../../services/custom-validators'

export const ICON_SIZE = 40

const options: Pick<IconOptions, 'className' | 'iconSize'> = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
}

const configuration = appConfiguration as unknown as typeof ConfigurationType

export const controls = {
  extra_bomen: {
    meta: {
      label: 'Waar is het?',
      language: {
        title: 'Selecteer de boom',
        subTitle: 'Kies een boom op de kaart',
        unregistered: 'De boom staat niet op de kaart',
        unregisteredId: undefined,
        objectTypeSingular: 'boom',
        objectTypePlural: 'bomen',
        submit: 'Bevestigen',
      },
      shortLabel: 'Boom',
      pathMerge: 'extra_properties',
      endpoint: configuration.map.layers?.bomen,
      wfsFilter:
        '<PropertyIsNotEqualTo><PropertyName>soortnaam_kort</PropertyName><Literal>Quercus</Literal></PropertyIsNotEqualTo><BBOX><PropertyName>geometrie</PropertyName><gml:Envelope srsName="{srsName}"><lowerCorner>{west} {south}</lowerCorner><upperCorner>{east} {north}</upperCorner></gml:Envelope></BBOX>',
      maxNumberOfAssets: configuration.map.options?.maxNumberOfAssets.bomen,
      featureTypes: [
        {
          label: 'Boom',
          description: 'Boom',
          icon: {
            options,
            iconUrl: '/assets/images/groen_water/tree.svg',
          },
          idField: 'id',
          typeValue: 'Bomen',
          typeField: 'type_soortnaam',
        },
        {
          label: 'Onbekend',
          description: 'De boom staat niet op de kaart',
          icon: {
            options,
            iconUrl: '/assets/images/feature-unknown-marker.svg',
          },
          typeValue: UNREGISTERED_TYPE,
          typeField: 'type',
        },
      ],
    },
    options: {
      validators: [validateObjectLocation('boom')],
    },
    render: QuestionFieldType.AssetSelect,
  },
}

export default controls
