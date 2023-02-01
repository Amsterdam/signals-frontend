// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { generateParams } from 'shared/services/api/api'
import CONFIGURATION from 'shared/services/configuration/configuration'

import { MAX_FILTER_LENGTH } from './constants'
import type { SelectedFilters, StoredParams } from '../types'

export const hasTooManyFiltersSelected = (
  storedParams: StoredParams,
  selectedFilters: SelectedFilters
): boolean => {
  const params = {
    ...storedParams,
    ...selectedFilters,
  }
  const requestUrl = `${CONFIGURATION.INCIDENTS_ENDPOINT}${
    params ? `?${generateParams(params)}` : ''
  }`

  return requestUrl.length > MAX_FILTER_LENGTH
}
