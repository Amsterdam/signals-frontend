import * as caterpillarIcons from '../../../signals/incident/definitions/wizard-step-2-vulaan/caterpillar-icons'

export const selection = [
  {
    id: 308777,
    type: 'Eikenboom',
    description: 'Eikenboom',
    isReported: false,
    location: {},
  },
  {
    id: '308779',
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
  label: 'Kies de boom waarin u de eikenprocessierupsen hebt gezien',
  shortLabel: 'Boom',
  pathMerge: 'extra_properties',
  endpoint:
    'https://services9.arcgis.com/YBT9ZoJBxXxS3cs6/arcgis/rest/services/EPR_2021_SIA_Amsterdam/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson&geometryType=esriGeometryEnvelope&geometry={{east},{south},{west},{north}}',
  featureTypes: [
    {
      label: 'Eikenboom',
      description: 'Eikenboom',
      iconId: 'oak',
      icon: {
        options: {},
        iconSvg: caterpillarIcons.oak,
        selectedIconSvg: caterpillarIcons.select,
        reportedIconSvg: caterpillarIcons.oakIsReported,
      },
      iconIsReportedId: 'oakIsReported',
      idField: 'OBJECTID',
      typeValue: 'Eikenboom',
      typeField: '',
      isReportedField: 'AMS_Meldingstatus',
      isReportedValue: 1,
    },
    {
      label: 'Eikenboom is reeds gemeld ',
      description: 'Eikenboom is reeds gemeld',
      iconId: 'oakIsReported',
      icon: {
        options: {},
        iconSvg: caterpillarIcons.oakIsReported,
        selectedIconSvg: caterpillarIcons.isSelectedAndReported,
      },
      iconIsReportedId: 'oakIsReported',
      idField: 'OBJECTID',
      typeValue: 'oakIsReported',
      typeField: '',
      isReportedField: 'AMS_Meldingstatus',
      isReportedValue: 1,
    },
  ],
  extraProperties: ['GlobalID'],
}
