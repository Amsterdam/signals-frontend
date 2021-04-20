// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type endpointType from 'shared/services/configuration/endpoint-definitions'

import type configurationType from '../../../../app.base.json'
import { prefixEndpoints } from './endpoints'

const windowConfig = (window as Window &
  typeof globalThis & { CONFIG: typeof configurationType }).CONFIG
const applicationConfig = windowConfig
  ? {
      ...windowConfig,
      ...(prefixEndpoints(windowConfig.apiBaseUrl) as typeof endpointType),
    }
  : {}

const deepFreeze = (object: Record<string, unknown>) => {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object)

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = object[name]

    if (value && typeof value === 'object') {
      deepFreeze(value as Record<string, unknown>)
    }
  }

  return Object.freeze(object)
}

export default deepFreeze(applicationConfig) as typeof configurationType &
  typeof endpointType
