export interface PlainTextMeta {
  name: string
  value: string
  ignoreVisibility?: boolean
  isVisible: boolean
  label?: string
  type?: string
  // valueAuthenticated is undefined in Wizard step 1. Not sure where/how it is used.
  valueAuthenticated?: string
}
