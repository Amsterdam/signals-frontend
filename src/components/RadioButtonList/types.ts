export interface Option {
  key: string
  value: string
}

export interface RadioButtonOption extends Option {
  name?: string
  topic?: string | null
  open_answer?: boolean
}
