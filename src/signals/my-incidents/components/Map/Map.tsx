import type Location from 'types/location'

import { markerIcon } from '../../../../shared/services/configuration/map-markers'
import { StyledCloseButton, StyledMapDetail, StyledMapViewer } from './styled'

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
