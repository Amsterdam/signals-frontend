import type Location from 'types/location'

import { markerIcon } from '../../../../shared/services/configuration/map-markers'
import { StyledMapDetail } from './styled'

type Props = {
  location: Location
}

export const Map = ({ location }: Props) => {
  return (
    <StyledMapDetail
      value={location}
      icon={markerIcon}
      hasZoomControls
      zoom={14}
    />
  )
}
