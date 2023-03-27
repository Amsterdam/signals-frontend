import {
  falsyOrNumber,
  inPast,
} from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

const dateTime = {
  meta: {
    ignoreVisibility: true,
    label: 'Wanneer was het?',
    canBeNull: true,
  },
  options: {
    validators: [falsyOrNumber, inPast],
  },
  render: QuestionFieldType.DateTimeInput,
}

export default dateTime
