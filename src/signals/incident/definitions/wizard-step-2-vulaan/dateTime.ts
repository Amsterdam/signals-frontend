import { Validators } from 'react-reactive-form'
import { QuestionFieldType } from 'types/question'

const dateTime = {
  meta: {
    label: 'Wanneer was het?',
    ifAllOf: {
      datetime: 'Eerder',
    },
  },
  options: {
    validators: [Validators.required],
  },
  render: QuestionFieldType.DateTimeInput,
}

export default dateTime
