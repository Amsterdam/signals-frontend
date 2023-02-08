// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type Location from 'types/location'

import { StyledCloseButton, StyledMapDetail, StyledMapViewer } from './styled'
import { markerIcon } from '../../../../shared/services/configuration/map-markers'

type Props = {
  location: Location
  close: () => void
}

export const Map = ({ location, close }: Props) => (
  <StyledMapViewer>
    <StyledMapDetail
      value={location}
      icon={markerIcon}
      hasZoomControls
      zoom={14}
    />
    <StyledCloseButton close={close} />
  </StyledMapViewer>
)
