import { nullOrNumber } from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

const dateTime = {
  meta: {
    ignoreVisibility: true,
    label: 'Wanneer was het?',
  },
  options: {
    validators: [nullOrNumber],
  },
  render: QuestionFieldType.DateTimeInput,
}

export default dateTime
