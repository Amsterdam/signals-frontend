import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import MapDetail from '../../../incident-management/containers/IncidentDetail/components/MapDetail'

export const StyledMapDetail = styled(MapDetail)`
  height: 450px;
  position: absolute;
  top: ${themeSpacing(8)};
  right: 0;
  left: 0;
  width: 100%;
`
