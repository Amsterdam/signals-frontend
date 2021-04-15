// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import endpoints from './endpoint-definitions'

export const prefixEndpoints = (apiBaseUrl = '') => {
  const prefix =
    apiBaseUrl === null || apiBaseUrl === undefined ? '' : apiBaseUrl
  return Object.entries(endpoints).reduce((acc, [key, value]) => {
    acc[key] = `${prefix}${value}`
    return acc
  }, {})
}
