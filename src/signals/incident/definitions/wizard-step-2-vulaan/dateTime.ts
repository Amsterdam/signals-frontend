import { falsyOrNumber } from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

const dateTime = {
  meta: {
    ignoreVisibility: true,
    label: 'Wanneer was het?',
    canBeNull: true,
  },
  options: {
    validators: [falsyOrNumber],
  },
  render: QuestionFieldType.DateTimeInput,
}

export default dateTime
