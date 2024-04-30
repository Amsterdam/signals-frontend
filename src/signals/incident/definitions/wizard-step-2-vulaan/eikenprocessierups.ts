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
  extra_eikenprocessierups: {
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
      endpoint: configuration.map.layers.eikenprocessierups,
      maxNumberOfAssets:
        configuration.map.options?.maxNumberOfAssets.eikenProcessierups,
      featureTypes: [
        {
          label: 'Eikenboom',
          description: 'Eikenboom',
          icon: {
            options,
            iconUrl: '/assets/images/groen_water/oak.svg',
          },
          idField: 'id',
          typeValue: 'Eikenboom',
          typeField: 'type',
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
    render: QuestionFieldType.CaterpillarSelect,
  },
  extra_nest_grootte: {
    meta: {
      label: 'Wat hebt u op de boom gezien?',
      shortLabel: 'Op de boom gezien',
      pathMerge: 'extra_properties',
      values: {
        klein: 'Nest is zo groot als een tennisbal',
        groot: 'Nest is zo groot als een voetbal',
        deken: 'Rupsen bedekken de stam als een deken',
        geen_nest: 'De rupsen in de boom hebben nog geen nest gevormd',
      },
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },
}

export default controls
