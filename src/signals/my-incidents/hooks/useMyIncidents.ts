// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useState } from 'react'

import type { MyIncident, MyIncidentsValue } from '../types'

export const useMyIncidents = (): MyIncidentsValue => {
  const [email, setEmail] = useState<string>()
  const [incidentsList, setIncidentsList] = useState<MyIncident[]>()
  const [incidentsDetail, setIncidentsDetail] = useState<MyIncident>()

  return {
    email,
    setEmail,
    incidentsList,
    setIncidentsList,
    incidentsDetail,
    setIncidentsDetail,
  }
}
