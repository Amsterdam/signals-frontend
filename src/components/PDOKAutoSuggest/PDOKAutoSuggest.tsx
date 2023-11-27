// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FC } from 'react'

import type { AutoSuggestProps } from 'components/AutoSuggest'
import AutoSuggest from 'components/AutoSuggest'
import configuration from 'shared/services/configuration/configuration'
import { addressPDOKDetails } from 'shared/services/map-location'
import type { RevGeo } from 'types/pdok/revgeo'

import type { PDOKDetails } from '../../shared/services/map-location'

const municipalityFilterName = 'gemeentenaam'
const numOptionsDeterminer = (data?: RevGeo) =>
  data?.response?.docs?.length || 0

export interface PDOKAutoSuggestProps
  extends Omit<
    AutoSuggestProps,
    'url' | 'formatResponse' | 'numOptionsDeterminer'
  > {
  municipality?: string
  pDOKDetails?: PDOKDetails
}

/**
 * Geocoder component that specifically uses the PDOK location service to request information from
 *
 * @see {@link https://github.com/PDOK/locatieserver/wiki/API-Locatieserver}
 */
const PDOKAutoSuggest: FC<PDOKAutoSuggestProps> = ({
  municipality = configuration.map.municipality,
  pDOKDetails = addressPDOKDetails,
  ...rest
}) => {
  const fq = municipality
    ? [['fq', `${municipalityFilterName}:(${municipality})`]]
    : []

  const fl = [['fl', pDOKDetails.fields.join(',')]]
  const params = [...fq, ...fl, ...pDOKDetails.serviceParams]
  const queryParams = params.map(([key, val]) => `${key}=${val}`).join('&')
  const url = `${configuration.map.pdok.suggest}?${queryParams}`

  return (
    <AutoSuggest
      {...rest}
      url={url}
      formatResponse={pDOKDetails.formatter}
      numOptionsDeterminer={numOptionsDeterminer}
      tabIndex={0}
    />
  )
}

export default PDOKAutoSuggest
