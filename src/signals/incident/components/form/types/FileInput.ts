import type { WizardSection } from 'signals/incident/definitions/wizard'
import type { FormMeta } from 'types/reactive-form'

export enum FileTypes {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
}

export interface Meta extends FormMeta {
  allowedFileTypes: FileTypes[]
  label: string
  maxFileSize: number
  maxNumberOfFiles: number
  minFileSize: number
  name: string
  subtitle: string
  isVisible?: boolean
}

export interface ParentMeta {
  updateIncident: (data: any) => void
  addToSelection?: () => void
  getClassification?: () => void
  handleSubmit?: () => void
  incidentsContainer?: {
    incident: {
      id: number
    }
  }
  removeFromSelection?: () => void
  wizard?: WizardSection
}

export interface Parent {
  meta: ParentMeta
  value?: any
}
