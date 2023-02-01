// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { createContext } from 'react'

import type { Definition } from './definitions/types'

const initialContext = { districts: undefined }

const IncidentManagementContext = createContext<{ districts?: Definition[] }>(
  initialContext
)

export default IncidentManagementContext
