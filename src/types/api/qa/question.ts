export enum FieldType {
  PlainText = 'plain_text',
  FileInput = 'file_input',
  TextInput = 'text_input',
  MultiTextInput = 'multi_text_input',
  CheckboxInput = 'checkbox_input',
  RadioInput = 'radio_input',
  SelectInput = 'select_input',
  TextareaInput = 'text_area_input',
  MapSelect = 'map_select',
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
