export interface PlainTextMeta {
  type?: string
  value: string
  name: string
  isVisible: boolean
  label?: string
  ignoreVisibility?: boolean
  // valueAuthenticated is undefined in Wizard step 1. Not sure where/how it is used.
  valueAuthenticated?: string
}
