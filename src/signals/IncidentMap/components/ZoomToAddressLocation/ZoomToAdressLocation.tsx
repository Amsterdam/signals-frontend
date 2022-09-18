// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useCallback, useState } from 'react'

import { Paragraph } from '@amsterdam/asc-ui'

import type { PdokResponse } from '../../../../shared/services/map-location'
import { StyledPDOKAutoSuggest } from '../../../incident/components/form/MapSelectors/Asset/Selector/DetailPanel/styled'

export const ZoomToAdressLocation = () => {
  const [vari, setVari] = useState('')
  /**
   * Address auto complete selection
   */
  // const setLocation = useCallback(
  //   (location: Location) => {
  //     const payload = getUpdatePayload(location)
  //
  //     updateIncident(payload)
  //   },
  //   [updateIncident, getUpdatePayload]
  // )

  const onAddressSelect = useCallback((option: PdokResponse) => {
    //   // const { location, address } = option.data
    //   // setLocation({ coordinates: location, address })
    //   console.log('option', option.data)
    setVari('option: ' + option.data)
  }, [])

  return (
    <>
      <Paragraph strong gutterBottom={16}>
        Zoom naar adres of postcode
      </Paragraph>

      <StyledPDOKAutoSuggest placeholder={vari} onSelect={onAddressSelect} />
    </>
  )
}
