// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
export const BASE_URL = ''
export const INCIDENTS_URL = `incidents`
export const MAP_URL = `kaart`
export const INCIDENT_URL = `incident`
export const DEFAULT_TEXTS_URL = `standaard/teksten`
export const SIGNALING_URL = `signalering`

const routes = {
  incidents: INCIDENTS_URL,
  map: MAP_URL,
  defaultTexts: DEFAULT_TEXTS_URL,
  signaling: SIGNALING_URL,
  incident: `${INCIDENT_URL}/:id`,
  split: `${INCIDENT_URL}/:id/split`,
  reporter: `${INCIDENT_URL}/:id/melder`,
  area: `${INCIDENT_URL}/:id/omgeving`,
}

export default routes
