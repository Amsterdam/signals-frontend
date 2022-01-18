import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants'

const locatie = {
  meta: {
    featureTypes: [],
    label: 'Waar is het?',
    language: {
      title: 'Locatie',
      subTitle: 'Waar is het?',
      description:
        'Typ het dichtsbijzijnde adres of klik de locatie aan op de kaart',
      submit: 'Gebruik deze locatie',
    },
    shortLabel: 'Waar is het?',
  },
  render: FIELD_TYPE_MAP.asset_select,
  options: {
    validators: ['required'],
  },
}

export default locatie
