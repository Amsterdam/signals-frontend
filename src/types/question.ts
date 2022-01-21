export enum QuestionFieldType {
  AssetSelect = 'AssetSelectRenderer',
  CaterpillarSelect = 'CaterpillarSelectRenderer',
  CheckboxInput = 'CheckboxInput',
  ClockSelect = 'ClockSelectRenderer',
  DateTimeInput = 'DateTimeInput',
  DescriptionInput = 'DescriptionInputRenderer',
  EmphasisCheckboxInput = 'EmphasisCheckboxInput',
  FileInput = 'FileInputRenderer',
  HandlingMessage = 'HandlingMessage',
  Header = 'Header',
  HiddenInput = 'HiddenInput',
  MapInput = 'MapInput',
  MultiTextInput = 'MultiTextInput',
  PlainText = 'PlainText',
  RadioInput = 'RadioInputGroup',
  SelectInput = 'SelectInput',
  StreetlightSelect = 'StreetlightSelectRenderer',
  TextInput = 'TextInput',
  TextareaInput = 'TextareaInput',
}

export interface FeatureType {
  description?: string
  label: string
  idField: string
  typeField: string
  typeValue: string
  icon?: {
    iconUrl: string
  }
}

export interface IfOneOrAllOf {
  [key: string]: unknown | IfOneOrAllOf
}

export interface Question {
  render: QuestionFieldType
  meta: {
    label: string
    subtitle?: string
    shortLabel?: string
    placeholder?: string
    type?: string
    autoremove?: string
    value?: string
    values?: Array<string>
    maxLength?: number
    endpoint?: string
    featureTypes?: Array<FeatureType>
    ifOneOf?: IfOneOrAllOf
    ifAllOf?: IfOneOrAllOf
    language?: {
      title: string
      unregistered?: string
      unregisteredId?: string
      submitSingular?: string
      submitPlural?: string
    }
  }
}
