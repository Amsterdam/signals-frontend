import { Close } from '@amsterdam/asc-assets'
import { Button, themeColor, breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { MENU_WIDTH, HANDLE_SIZE_MOBILE } from '../DrawerOverlay/styled'
import { DetailContent } from './DetailContent'

const CloseButton = styled(Button)`
  position: absolute;
  top: 14px;
  right: 20px;
  min-width: inherit;

  > span {
    margin-right: 0;
  }
`

const DetailsWrapper = styled.section`
  position: absolute;
  padding: 20px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: calc(${MENU_WIDTH}px - 16px);
  max-width: 100%;
  z-index: 2;

  background-color: ${themeColor('tint', 'level1')};

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    width: 100vh;
    overflow-y: scroll;
    top: unset;
    height: calc(100% - ${HANDLE_SIZE_MOBILE}px);
  }
`

interface Props {
  onClose: () => void
  incident: any
}

export const DetailPanel = ({ onClose, incident }: Props) => {
  if (!incident) {
    return null
  }

  return (
    <DetailsWrapper id="device-details">
      <CloseButton
        type="button"
        variant="blank"
        title="Legenda"
        data-testid="legenda"
        iconSize={20}
        onClick={onClose}
        iconLeft={<Close />}
      />
      <DetailContent incident={incident} />
    </DetailsWrapper>
  )
}
