export interface State {
  formOptions: OptionMapped[]
  renderSection: any
  shouldRender: boolean
}

export interface Action {
  payload: any
  type: string
}

export interface Option {
  is_satisfied: boolean
  open_answer: boolean
  text: string
  topic: string
}

export interface OptionMapped {
  is_satisfied: boolean
  key: string
  open_answer: boolean
  topic: string
  value: string
}

export interface AnswerResponse {
  results: Option[]
  count: number
}

export interface FeedbackFormData {
  signal_id: string
}
