import locatie from './locatie'
import { QuestionFieldType } from '../../../../types/question'

export const overig = {
  locatie,
  wonen_overig: {
    meta: {
      ifAllOf: {
        subcategory: 'wonen-overig',
      },
      label: 'Uw melding gaat over:',
      values: {
        vakantieverhuur:
          'Illegale toeristische verhuur in een woning of woonboot',
        onderhuur: 'Illegale onderhuur in een woning of woonboot',
        leegstand: 'Een woning of woonboot die opvallend lang leeg staat',
        crimineleBewoning:
          'Criminele bewoning of activiteiten in een woning of woonboot',
        woningdelen:
          'Woningdelen (de woning wordt door verschillende mensen gedeeld)',
        woningkwaliteit:
          'Achterstallig onderhoud of een gebrek aan een woning wordt niet verholpen door de eigenaar/beheerder',
        verhuurderschap: 'Problemen met verhuuders',
      },
      resetsStateOnChange: true,
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
}
