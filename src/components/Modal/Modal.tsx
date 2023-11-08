// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { Close as CloseIcon } from '@amsterdam/asc-assets'
import {
  Button,
  Row,
  Column,
  Modal as ASCModal,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const StyledModal = styled(ASCModal)`
  max-height: 100vh;
  min-height: 200px;
  height: 100vh;
  max-width: 1430px;
  overflow-y: hidden;
`

const ModalInner = styled.div`
  height: calc(100vh - (60px + 40px));
  max-width: 1800px;
  padding: ${themeSpacing(4, 4, 4, 11)};
  overflow: hidden;
  overflow-y: auto;

  ${({ theme }) => css`
    ${theme.breakpoints.laptopM('max-width')} {
      max-width: 1200px;
    }

    ${theme.breakpoints.laptop('max-width')} {
      max-width: 1024px;
    }

    ${theme.breakpoints.tabletM('max-width')} {
      max-width: 768px;
    }
  `}
`

const HeaderRow = styled(Row)`
  position: relative;
  flex-wrap: nowrap;
`

const Header = styled.header`
  background: ${themeColor('bright', 'main')};
  padding: ${themeSpacing(2, 0)};
  border-bottom: 2px solid #e6e6e6;
`

const H2 = styled.h2`
  margin: 0;
`

const StyledColumn = styled(Column)`
  flex-direction: column;
`

interface ModalProps {
  children: ReactNode
  title: string
  onClose: () => void
  isOpen: boolean
}

const Modal = ({ children, title, onClose, ...rest }: ModalProps) => (
  <ModalWrapper>
    <StyledModal data-testid="modal" open backdropOpacity={1} {...rest}>
      <Header>
        <HeaderRow>
          <H2>{title}</H2>

          <Button
            data-testid="close-btn"
            square
            onClick={onClose}
            size={32}
            iconSize={20}
            variant="blank"
            icon={<CloseIcon />}
          />
        </HeaderRow>
      </Header>

      <ModalInner data-scroll-lock-scrollable>
        <StyledColumn span={12}>{children}</StyledColumn>
      </ModalInner>
    </StyledModal>
  </ModalWrapper>
)

Modal.defaultProps = {
  children: null,
  // setting default value for non-exposed prop: should not be visible; just for testing purposes
  disablePortal: process.env.NODE_ENV === 'test', // eslint-disable-line react/default-props-match-prop-types
  onClose: null,
}

Modal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  title: PropTypes.string.isRequired,
}

export default Modal
