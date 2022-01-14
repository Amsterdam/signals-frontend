import oakUrl from 'shared/images/groen_water/oak.svg?url'
import reportedFeatureMarkerUrl from '*.svg?url'
import checkedFeatureMarkerUrl from '*.svg?url'

export const selection = [
  {
    id: 308777,
    type: 'Eikenboom',
    description: 'Eikenboom',
    isReported: false,
    location: {},
  },
  {
    id: 308779,
    type: 'not-on-map',
    description: 'De boom staat niet op de kaart',
    isReported: false,
    location: {},
  },
  {
    id: 308778,
    type: 'Eikenboom',
    description: 'Eikenboom',
    isReported: true,
    location: {},
  },
]

export const meta = {
  ifAllOf: {
    subcategory: 'eikenprocessierups',
  },
  label: 'Waar is het?',
  shortLabel: 'Boom',
  pathMerge: 'extra_properties',
  endpoint:
    'https://services9.arcgis.com/YBT9ZoJBxXxS3cs6/arcgis/rest/services/EPR_2021_SIA_Amsterdam/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson&geometryType=esriGeometryEnvelope&geometry={{east},{south},{west},{north}}',
  featureTypes: [
    {
      label: 'Eikenboom',
      description: 'Eikenboom',
      icon: {
        options: {},
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
        options: {},
        iconUrl: reportedFeatureMarkerUrl,
      },
      iconIsReportedId: 'oakIsReported',
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
        options: {},
        iconUrl: checkedFeatureMarkerUrl,
      },
      idField: 'OBJECTID',
      typeValue: 'checked',
      typeField: '',
      isReportedField: 'AMS_Meldingstatus',
      isReportedValue: 1,
      isCheckedField: 'Registratie',
      isCheckedValues: ['Bestreden', 'Geen EPR'],
    },
  ],
  extraProperties: ['GlobalID'],
}
