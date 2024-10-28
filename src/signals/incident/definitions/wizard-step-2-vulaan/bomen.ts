// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { IconOptions } from 'leaflet'

import { UNREGISTERED_TYPE } from 'signals/incident/components/form/MapSelectors/constants'
import { QuestionFieldType } from 'types/question'

import type ConfigurationType from '../../../../../app.amsterdam.json'
import appConfiguration from '../../../../shared/services/configuration/configuration'
import { FeatureStatus } from '../../components/form/MapSelectors/types'
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
      label: 'Waar is het? TEST BOMEN', // TODO
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
      endpoint:
        'https://api.data.amsterdam.nl/v1/wfs/bomen/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=stamgegevens&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&outputFormat=application/json', // TODO
      wfsFilter:
        '<PropertyIsNotEqualTo><PropertyName>soortnaam_kort</PropertyName><Literal>Quercus</Literal></PropertyIsNotEqualTo><BBOX><PropertyName>geometrie</PropertyName><gml:Envelope srsName="{srsName}"><lowerCorner>{west} {south}</lowerCorner><upperCorner>{east} {north}</upperCorner></gml:Envelope></BBOX>',
      maxNumberOfAssets:
        configuration.map.options?.maxNumberOfAssets.eikenProcessierups, // TODO
      featureTypes: [
        {
          label: 'Eikenboom',
          description: 'Eikenboom',
          icon: {
            options,
            iconUrl: '/assets/images/groen_water/oak.svg',
          },
          idField: 'id',
          typeValue: 'Bomen',
          typeField: 'type_soortnaam', // TODO: dit is een filter geloof ik, juiste instellen
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
      featureStatusTypes: [
        {
          label: 'Is gemeld',
          description: 'Eikenboom is reeds gemeld',
          icon: {
            options,
            iconUrl: '/assets/images/icon-reported-marker.svg',
          },
          idField: 'OBJECTID',
          typeValue: FeatureStatus.REPORTED,
          typeField: '',
          statusField: 'Registratie',
          statusValues: ['Deels bestreden', 'Melding', 'Registratie'],
        },
        {
          label: 'Vrij van eikenprocessierups',
          description: 'Vrij van eikenprocessierups',
          icon: {
            options,
            iconUrl: '/assets/images/icon-checked-marker.svg',
          },
          idField: 'OBJECTID',
          typeValue: FeatureStatus.CHECKED,
          typeField: '',
          statusField: 'Registratie',
          statusValues: ['Bestreden', 'Geen EPR', 'EPR (niet bestrijden)'],
        },
      ],
      extraProperties: ['GlobalID'],
    },
    options: {
      validators: [validateObjectLocation('boom')],
    },
    render: QuestionFieldType.StreetlightSelect, // TODO: dit waarsch nog aanpassen
  },
}

export default controls
