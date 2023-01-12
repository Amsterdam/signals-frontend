// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
export const BASE_URL = '/manage'
export const INCIDENTS_URL = `${BASE_URL}/incidents`
export const MAP_URL = `${BASE_URL}/incidents/kaart`
export const INCIDENT_URL = `${BASE_URL}/incident`
export const DEFAULT_TEXTS_URL = `${BASE_URL}/standaard/teksten`
export const SIGNALING_URL = `${BASE_URL}/signalering`
export const DASHBOARD_URL = `${BASE_URL}/dashboard`

const routes = {
  incidents: INCIDENTS_URL,
  map: MAP_URL,
  defaultTexts: DEFAULT_TEXTS_URL,
  signaling: SIGNALING_URL,
  dashboard: DASHBOARD_URL,
  incident: `${INCIDENT_URL}/:id(\\d+)`,
  split: `${INCIDENT_URL}/:id(\\d+)/split`,
  reporter: `${INCIDENT_URL}/:id(\\d+)/melder`,
  area: `${INCIDENT_URL}/:id(\\d+)/omgeving`,
}

export default routes
