import { themeSpacing } from '@amsterdam/asc-ui'
import CloseButton from 'components/CloseButton'
import styled from 'styled-components'

import MapDetail from '../../../../components/MapDetail'

export const StyledMapViewer = styled.div`
  position: relative;
  top: ${themeSpacing(5)};
`

export const StyledCloseButton = styled(CloseButton)`
  z-index: 400;
  top: 16px;
  right: 0;
`

export const StyledMapDetail = styled(MapDetail)`
  height: 450px;
  width: 100%;
`
