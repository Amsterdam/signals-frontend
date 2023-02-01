// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import merge from 'lodash/merge'

import incident from 'utils/__tests__/fixtures/incident.json'

import type { Incident } from './incident'

export const mockIncident = (overrides?: any): Incident => {
  return merge({}, incident, overrides)
}
