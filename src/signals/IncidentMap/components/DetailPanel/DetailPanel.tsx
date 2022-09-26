import { Close } from '@amsterdam/asc-assets'
import { Button, themeColor, breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { MENU_WIDTH, HANDLE_SIZE_MOBILE } from '../DrawerOverlay/styled'

// TODO: Dummy details. Should be replaced with actual data.

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
}

export const DetailPanel = ({ onClose }: Props) => {
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
      <ul>
        <li>Name</li>
        <li>Number</li>
        <li>Street</li>
        <li>City</li>
        <li>Phone</li>
        <li>Test</li>
        <li>Notes</li>
      </ul>
    </DetailsWrapper>
  )
}
