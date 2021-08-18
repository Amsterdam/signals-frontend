import { Question } from './question'

export interface Answer {
  _display: string
  payload: string
  session: string
  questionnaire: string
  created_at: string
  next_question: Question | null
}
