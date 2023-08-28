import type { WizardSection } from 'signals/incident/definitions/wizard'
import type { FormMeta } from 'types/reactive-form'

export const enum FileTypes {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
}

export interface Meta extends FormMeta {
  allowedFileTypes: FileTypes[]
  isVisible: boolean
  label: string
  maxFileSize: number
  maxNumberOfFiles: number
  minFileSize: number
  name: string
  subtitle: string
}

export interface Parent {
  meta: {
    addToSelection: () => void
    getClassification: () => void
    handleSubmit: () => void
    incidentContainer: () => void
    removeFromSelection: () => void
    wizard: WizardSection
  }
}
