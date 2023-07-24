export interface State {
  formOptions: any
  renderSection: any
  shouldRender: boolean
}

export interface Action {
  payload: any
  type: any
}

interface Option {
  is_satisfied: boolean
  open_answer: boolean
  text: string
  topic: string
}

export interface AnswerResponse {
  results: Option[]
  count: number
}

export interface FeedbackFormData {
  signal_id: string
}
