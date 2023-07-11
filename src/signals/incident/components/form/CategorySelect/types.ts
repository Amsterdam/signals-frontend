// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { WizardSection } from 'signals/incident/definitions/wizard'
import type { Incident } from 'types/incident'

export interface Meta {
  name: string
  updateIncident: (data: any) => void
}

export interface IncidentContainer {
  classificationPrediction: Record<string, any>
  incident: Incident
  loading: boolean
  loadingData: boolean
  mapActive: boolean
  usePredictions: boolean
}

export interface ParentMeta {
  addToSelection: () => void
  getClassification: () => void
  handleSubmit: (_x: unknown, _x2: unknown, _x3: unknown) => void
  incidentContainer: IncidentContainer
  removeFromSelection: () => void
  updateIncident: (data: unknown) => void
  wizard: WizardSection
}
