// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { createContext } from 'react'

const initialContext = { incident: undefined }

const IncidentDetailContext = createContext(initialContext)

export default IncidentDetailContext
