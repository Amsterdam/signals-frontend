import { Button, Modal, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  background-color: ${themeColor('tint', 'level7')};
  min-width: ${themeSpacing(16)};

  & svg {
    // Make the close icon white (https://codepen.io/sosuke/pen/Pjoqqp)
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(164deg)
      brightness(103%) contrast(103%);
  }

  &:hover {
    background-color: ${themeColor('tint', 'level7')}b3;

    & svg {
      // Make the close icon white (https://codepen.io/sosuke/pen/Pjoqqp)
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(164deg)
        brightness(103%) contrast(103%);
    }
  }
`

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

export const StyledModal = styled(Modal)`
  max-height: 100vh;
  height: 100vh;
  max-width: 100vw;
  width: 100vw;
  background-color: transparent;
`

export const ModalInner = styled.div`
  height: 100vh;
  overflow: hidden;
  text-align: center;
`

export const Header = styled.header`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: ${themeSpacing(4)};
  height: ${themeSpacing(16)};
  background-color: ${themeColor('tint', 'level7')}b3;
  color: ${themeColor('tint', 'level1')};
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${themeSpacing(5)};
  white-space: nowrap;
`

export const Reporter = styled.div`
  width: fit-content;
  margin-top: ${themeSpacing(3)};
  padding 0 ${themeSpacing(2)};
  background-color: white;
  color: black;
  font-size: ${themeSpacing(3)};
  line-height: ${themeSpacing(5)};
  text-transform: uppercase;
  font-weight: bold;
`

export const Employee = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: ${themeSpacing(2)};
  font-size: ${themeSpacing(4)};
  line-height: ${themeSpacing(6)};
`

export const Date = styled.div`
  margin-bottom: ${themeSpacing(2)};
  font-size: ${themeSpacing(4)};
  line-height: ${themeSpacing(6)};
`

export const Title = styled.div`
  margin-top: ${themeSpacing(2)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${themeSpacing(4)};
  line-height: ${themeSpacing(6)};
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
`
export const CloseButton = styled(StyledButton)`
  justify-self: end;
`

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const PreviousButton = styled(StyledButton)`
  position: absolute;
  left: 0;
  top: 50%;
`

export const NextButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  top: 50%;
`

export const Img = styled.img`
  margin: ${themeSpacing(23, 0, 5)};
  max-width: 100%;
  max-height: calc(100% - ${themeSpacing(28)});
`
