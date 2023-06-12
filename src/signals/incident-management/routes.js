// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
export const BASE_URL = '/manage'
export const INCIDENTS_URL = `${BASE_URL}/incidents`
export const MAP_URL = `${BASE_URL}/incidents/kaart`
export const INCIDENT_URL = `${BASE_URL}/incident`
export const STANDARD_TEXT_URL_V1 = `${BASE_URL}/v1/standaardteksten`
export const STANDARD_TEXT_URL_V2 = `${BASE_URL}/v2/standaardteksten`
export const SIGNALING_URL = `${BASE_URL}/signalering`

const routes = {
  incidents: INCIDENTS_URL,
  map: MAP_URL,
  defaultTexts: STANDARD_TEXT_URL_V1,
  standardTexts: STANDARD_TEXT_URL_V2,
  signaling: SIGNALING_URL,
  incident: `${INCIDENT_URL}/:id(\\d+)`,
  split: `${INCIDENT_URL}/:id(\\d+)/split`,
  reporter: `${INCIDENT_URL}/:id(\\d+)/melder`,
  area: `${INCIDENT_URL}/:id(\\d+)/omgeving`,
}

export default routes
