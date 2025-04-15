// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { formatISO } from 'date-fns/formatISO'

import type { WizardSection } from 'signals/incident/definitions/wizard'
import type { Incident } from 'types/incident'

import mapPaths from '../map-paths'
import mapValues from '../map-values'

const mapControlsToParams = (incident: Incident, wizard: WizardSection) => {
  let params = {
    reporter: {},
    incident_date_start:
      typeof incident.dateTime === 'number'
        ? formatISO(incident.dateTime)
        : formatISO(Date.now()),
  }

  params = mapValues(params, incident, wizard)
  params = mapPaths(params, incident, wizard)

  return params
}

export default mapControlsToParams
