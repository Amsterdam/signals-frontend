import { Control } from 'react-hook-form'

export type FormData = {
  [key: string]: unknown
}

export interface FieldProps {
  label: string
  errorMessage?: string
  id: string
  control: Control<FormData>
  register: any
  trigger: (id: string) => void
}
