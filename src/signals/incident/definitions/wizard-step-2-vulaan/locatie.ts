import { QuestionFieldType } from 'types/question'

const locatie = {
  meta: {
    featureTypes: [],
    label: 'Waar is het?',
    language: {
      title: 'Locatie',
      subTitle: 'Waar is het?',
      description:
        'Typ het dichtstbijzijnde adres of klik de locatie aan op de kaart',
      submit: 'Gebruik deze locatie',
    },
    shortLabel: 'Waar is het?',
  },
  render: QuestionFieldType.AssetSelect,
  options: {
    validators: ['required'],
  },
}

export default locatie
