// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FC } from 'react'
import type { RevGeo } from 'types/pdok/revgeo'

import type { PdokResponse } from 'shared/services/map-location'

import AutoSuggest from 'components/AutoSuggest'
import {
  pdokResponseFieldList,
  formatPDOKResponse,
} from 'shared/services/map-location'
import configuration from 'shared/services/configuration/configuration'

const municipalityFilterName = 'gemeentenaam'
const serviceParams = [
  ['fq', 'bron:BAG'],
  ['fq', 'type:adres'],
  ['q', ''],
]
const serviceUrl =
  'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest/?'

const numOptionsDeterminer = (data?: RevGeo) =>
  data?.response?.docs?.length || 0

type PDOKAutoSuggestProps = {
  className?: string
  fieldList?: Array<string>
  municipality?: string | Array<string>
  onClear?: () => void
  onSelect: (option: PdokResponse) => void
  placeholder?: string
  value?: string
}

/**
 * Geocoder component that specifically uses the PDOK location service to request information from
 *
 * @see {@link https://www.pdok.nl/restful-api/-/article/pdok-locatieserver#/paths/~1suggest/get}
 */
const PDOKAutoSuggest: FC<PDOKAutoSuggestProps> = ({
  className,
  fieldList,
  municipality,
  onClear,
  onSelect,
  placeholder,
  value,
  ...rest
}) => {
  const municipalityArray = Array.isArray(municipality)
    ? municipality
    : [municipality].filter(Boolean)
  const municipalityString = municipalityArray
    .map((item) => `"${item}"`)
    .join(' ')
  const fq = municipality
    ? [['fq', `${municipalityFilterName}:(${municipalityString})`]]
    : []
  // ['fl', '*'], // undocumented; requests all available field values from the API
  const fl = [
    ['fl', [...pdokResponseFieldList, ...(fieldList || [])].join(',')],
  ]
  const params = [...fq, ...fl, ...serviceParams]
  const queryParams = params.map(([key, val]) => `${key}=${val}`).join('&')
  const url = `${serviceUrl}${queryParams}`

  return (
    <AutoSuggest
      className={className}
      formatResponse={formatPDOKResponse}
      numOptionsDeterminer={numOptionsDeterminer}
      onClear={onClear}
      onSelect={onSelect}
      placeholder={placeholder}
      url={url}
      value={value}
      {...rest}
    />
  )
}

PDOKAutoSuggest.defaultProps = {
  className: '',
  fieldList: [],
  municipality: configuration.map.municipality,
  value: '',
}

export default PDOKAutoSuggest
