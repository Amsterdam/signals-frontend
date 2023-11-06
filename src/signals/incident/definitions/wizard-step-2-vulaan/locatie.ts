import { QuestionFieldType } from 'types/question'

const locatie = {
  meta: {
    featureTypes: [],
    label: 'Waar is het?',
    language: {
      title: 'Selecteer de locatie',
      subTitle: 'Waar is het?',
      description:
        'Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik "Mijn locatie"',
      submit: 'Bevestigen',
    },
    shortLabel: 'Waar is het?',
  },
  render: QuestionFieldType.LocationSelect,
  options: {
    validators: ['required'],
  },
}

export default locatie
