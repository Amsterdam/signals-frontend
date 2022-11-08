// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useState } from 'react'

import type { MyIncidentsValue } from '../types'

export const useMyIncidents = (): MyIncidentsValue => {
  const [email, setEmail] = useState<string>()

  return {
    email,
    setEmail,
  }
}
