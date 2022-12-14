import type { Question } from './question'

type File = {
  description: string
  file: string
}

type ExplanationSection = {
  files: File[]
  header: string
  text: string
}

export type Explanation = {
  title: string
  sections: ExplanationSection[]
}

export interface Questionnaire {
  uuid: string
  first_question: Question
  name: string
  description: string | null
  is_active: boolean
}
