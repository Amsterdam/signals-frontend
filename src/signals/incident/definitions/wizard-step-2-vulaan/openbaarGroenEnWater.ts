// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants'
import type { IconOptions } from 'leaflet'
import oakUrl from 'shared/images/groen_water/oak.svg?url'
import reportedFeatureMarkerUrl from 'shared/images/icon-reported-marker.svg?url'
import unknownFeatureMarkerUrl from 'shared/images/featureUnknownMarker.svg?url'
import { validateObjectLocation } from '../../services/custom-validators'

export const ICON_SIZE = 40

const options: Pick<IconOptions, 'className' | 'iconSize'> = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
}

export const controls = {
  extra_eikenprocessierups: {
    meta: {
      ifAllOf: {
        subcategory: 'eikenprocessierups',
      },
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
            iconUrl: oakUrl,
          },
          idField: 'OBJECTID',
          typeValue: 'Eikenboom',
          typeField: '',
          isReportedField: 'AMS_Meldingstatus',
          isReportedValue: 1,
        },
        {
          label: 'Eikenboom is reeds gemeld ',
          description: 'Eikenboom is reeds gemeld',
          icon: {
            options,
            iconUrl: reportedFeatureMarkerUrl,
          },
          idField: 'OBJECTID',
          typeValue: 'reported',
          typeField: '',
          isReportedField: 'AMS_Meldingstatus',
          isReportedValue: 1,
        },
        {
          label: 'Onbekend',
          description: 'De boom staat niet op de kaart',
          icon: {
            options,
            iconUrl: unknownFeatureMarkerUrl,
          },
          typeValue: 'not-on-map',
          typeField: '',
        },
      ],
      extraProperties: ['GlobalID'],
    },
    options: {
      validators: [validateObjectLocation('boom')],
    },
    render: FIELD_TYPE_MAP.caterpillar_select,
  },
  extra_nest_grootte: {
    meta: {
      ifAllOf: {
        subcategory: 'eikenprocessierups',
      },
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
    render: FIELD_TYPE_MAP.radio_input,
  },
}

export default controls
