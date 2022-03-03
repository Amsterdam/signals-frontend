// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { IconOptions } from 'leaflet'
import { UNREGISTERED_TYPE } from 'signals/incident/components/form/MapSelectors/constants'
import { QuestionFieldType } from 'types/question'
import { validateObjectLocation } from '../../services/custom-validators'

export const ICON_SIZE = 40

const options: Pick<IconOptions, 'className' | 'iconSize'> = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
}

export const controls = {
  extra_eikenprocessierups: {
    meta: {
      label: 'Waar is het?',
      language: {
        title: 'Locatie',
        subTitle: 'Kies een boom op de kaart',
        unregistered: 'De boom staat niet op de kaart',
        unregisteredId: undefined,
        objectTypeSingular: 'boom',
        objectTypePlural: 'bomen',
        submit: 'Gebruik deze locatie',
      },
      shortLabel: 'Boom',
      pathMerge: 'extra_properties',
      endpoint:
        'https://services9.arcgis.com/YBT9ZoJBxXxS3cs6/arcgis/rest/services/EPR_2021_SIA_Amsterdam/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson&geometryType=esriGeometryEnvelope&geometry={{east},{south},{west},{north}}',
      featureTypes: [
        {
          label: 'Eikenboom',
          description: 'Eikenboom',
          icon: {
            options,
            iconUrl: '/assets/images/groen_water/oak.svg',
          },
          idField: 'OBJECTID',
          typeValue: 'Eikenboom',
          typeField: '',
        },
        {
          label: 'Is gemeld',
          description: 'Eikenboom is reeds gemeld',
          icon: {
            options,
            iconUrl: '/assets/images/icon-reported-marker.svg',
          },
          idField: 'OBJECTID',
          typeValue: 'reported',
          typeField: '',
          isReportedField: 'AMS_Meldingstatus',
          isReportedValue: 1,
        },
        {
          label: 'Vrij van eikenprocessierups',
          description: 'Vrij van eikenprocessierups',
          icon: {
            options,
            iconUrl: '/assets/images/icon-checked-marker.svg',
          },
          idField: 'OBJECTID',
          typeValue: 'checked',
          typeField: '',
          isCheckedField: 'Registratie',
          isCheckedValues: ['Bestreden', 'Geen EPR'],
        },
        {
          label: 'Onbekend',
          description: 'De boom staat niet op de kaart',
          icon: {
            options,
            iconUrl: '/assets/images/featureUnknownMarker.svg',
          },
          typeValue: UNREGISTERED_TYPE,
          typeField: '',
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
