// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FC } from 'react'

import type { AutoSuggestProps } from 'components/AutoSuggest'
import AutoSuggest from 'components/AutoSuggest'
import configuration from 'shared/services/configuration/configuration'
import {
  pdokResponseFieldList,
  formatPDOKResponse,
} from 'shared/services/map-location'
import type { RevGeo } from 'types/pdok/revgeo'

const municipalityFilterName = 'gemeentenaam'
const serviceParams = [
  ['fq', 'bron:BAG'],
  ['fq', 'type:adres'],
  ['q', ''],
]

const numOptionsDeterminer = (data?: RevGeo) =>
  data?.response?.docs?.length || 0

export interface PDOKAutoSuggestProps
  extends Omit<
    AutoSuggestProps,
    'url' | 'formatResponse' | 'numOptionsDeterminer'
  > {
  fieldList?: Array<string>
  municipality?: string
}

/**
 * Geocoder component that specifically uses the PDOK location service to request information from
 *
 * @see {@link https://github.com/PDOK/locatieserver/wiki/API-Locatieserver}
 */
const PDOKAutoSuggest: FC<PDOKAutoSuggestProps> = ({
  fieldList = [],
  municipality = configuration.map.municipality,
  ...rest
}) => {
  const fq = municipality
    ? [['fq', `${municipalityFilterName}:(${municipality})`]]
    : []
  // ['fl', '*'], // undocumented; requests all available field values from the API
  const fl = [
    ['fl', [...pdokResponseFieldList, ...(fieldList || [])].join(',')],
  ]
  const params = [...fq, ...fl, ...serviceParams]
  const queryParams = params.map(([key, val]) => `${key}=${val}`).join('&')
  const url = `${configuration.map.pdok.suggest}?${queryParams}`

  return (
    <AutoSuggest
      {...rest}
      url={url}
      formatResponse={formatPDOKResponse}
      numOptionsDeterminer={numOptionsDeterminer}
      tabIndex={0}
    />
  )
}

export default PDOKAutoSuggest
