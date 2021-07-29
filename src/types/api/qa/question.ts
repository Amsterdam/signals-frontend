export enum FieldType {
  PlainText = 'plain_text',
  FileInput = 'file_input',
}

export interface Question {
  key: string | null
  uuid: string
  label: string
  short_label: string
  field_type: FieldType
  next_rules: string | null
  required: boolean
}
