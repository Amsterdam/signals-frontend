import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

const maaien = {
  locatie,
  extra_gras_of_berm_onveilig: {
    meta: {
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
      label: 'Zorgt het gras of de berm voor een onveilige situatie?',
      shortLabel: 'Onveilige situatie gras of berm',
      subtitle: 'Bijvoorbeeld slecht zicht voor het verkeer.',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_groen_voor_recreatie: {
    meta: {
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
      label:
        'Gaat het om groen voor recreatie, zoals grasvelden in parken, hondenveldjes en speelweitjes?',
      shortLabel: 'Groen voor recreatie',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_maaien_geen_melding: {
    meta: {
      ifOneOf: {
        extra_groen_voor_recreatie: ['nee'],
      },
      type: 'alert',
      value: `U kunt hier geen melding over doen.  
We hebben vaste momenten om te maaien. [Bekijk wanneer en hoe we maaien.](https://www.amsterdam.nl/leefomgeving/dieren-groen/maaien/)`,
    },
    render: QuestionFieldType.PlainText,
  },
}

export default maaien
