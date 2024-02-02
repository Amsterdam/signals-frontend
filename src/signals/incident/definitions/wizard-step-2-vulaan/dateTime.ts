import {
  falsyOrNumberOrNow,
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
    validators: [falsyOrNumberOrNow, inPast],
  },
  render: QuestionFieldType.DateTimeInput,
}

export default dateTime
