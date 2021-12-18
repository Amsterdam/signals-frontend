import { useContext } from 'react'
import styled from 'styled-components'
import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'

import type { FC } from 'react'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'

import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import useLayerVisible from '../../../hooks/useLayerVisible'

const ButtonBarStyle = styled.div<{ messageVisible: boolean }>`
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    margin-top: ${({ messageVisible }) => messageVisible && themeSpacing(11)};
  }
`

const ButtonBar: FC<{ zoomLevel: ZoomLevel }> = ({ children, zoomLevel }) => {
  const layerVisible = useLayerVisible(zoomLevel)
  const { message } = useContext(AssetSelectContext)
  const messageVisible = !layerVisible || !!message

  return (
    <ButtonBarStyle data-testid="buttonBar" messageVisible={messageVisible}>
      {children}
    </ButtonBarStyle>
  )
}

export default ButtonBar
