import { Question } from './question'

export interface Questionnaire {
  uuid: string
  first_question: Question
  name: string
  description: string | null
  is_active: boolean
}
