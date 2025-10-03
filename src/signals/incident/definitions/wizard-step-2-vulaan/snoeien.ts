import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

const snoeien = {
  locatie,
  extra_plant_of_boom_onveilig: {
    meta: {
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
      label: 'Zorgt de plant of boom voor een onveilige situatie?',
      shortLabel: 'Onveilige situatie plant of boom',
      subtitle:
        'Bijvoorbeeld slecht zicht voor het verkeer of doordat takken loshangen of laaghangen?',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_snoeien_geen_melding: {
    meta: {
      ifOneOf: {
        extra_plant_of_boom_onveilig: ['nee'],
      },
      type: 'alert',
      value: `U kunt hier geen melding over doen.  
      Wij controleren regelmatig bomen en struiken. Als dat voor de boom of struik goed is snoeien wij hem. Dat doen we alleen in het voorjaar en het najaar. [Lees meer over hoe we voor bomen zorgen.](https://www.amsterdam.nl/leefomgeving/dieren-groen/bomen/)`,
    },
    render: QuestionFieldType.PlainText,
  },
}

export default snoeien
