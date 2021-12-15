import type { BaseItem } from '../types'

export interface FeatureType {
  label: string
  description: string
  iconId: string
  iconIsReportedId: string
  idField: string
  typeValue: string
  isReportedField: string
  isReportedValue: string | number | boolean
}

export interface Item extends BaseItem {
  isReported?: boolean
  [key: string]: unknown
}

export type Icon = {
  id: string
  icon: string
}

export interface Meta extends Record<string, unknown> {
  name: string
  endpoint: string
  featureTypes: FeatureType[]
  wfsFilter?: string
  icons: Icon[]
  extraProperties: string[]
}
