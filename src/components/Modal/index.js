// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Button, Row, Column, Modal as ASCModal, Heading, themeColor } from '@amsterdam/asc-ui';
import { Close as CloseIcon } from '@amsterdam/asc-assets';

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StyledModal = styled(ASCModal)`
  & [role='dialog'] {
    max-height: 100vh;
    height: 100vh;
    max-width: 1430px;
  }
`;

const ModalInner = styled.div`
  height: calc(100vh - (60px + 40px));
  max-width: 1800px;
  padding-top: 20px;
  padding-bottom: 20px;
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
`;

const HeaderRow = styled(Row)`
  position: relative;
  flex-wrap: nowrap;
`;

const Header = styled.header`
  background: ${themeColor('bright', 'main')};
  padding: 10px 0;
  border-bottom: 2px solid #e6e6e6;
`;

const Modal = ({ children, title, onClose, ...rest }) => (
  <ModalWrapper>
    <StyledModal data-testid="modal" open backdropOpacity={1} {...rest}>
      <Header>
        <HeaderRow>
          <Column span={12}>
            <Heading forwardedAs="h2">{title}</Heading>
          </Column>

          <Button
            data-testid="closeBtn"
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
        <Row>
          <Column span={12}>{children}</Column>
        </Row>
      </ModalInner>
    </StyledModal>
  </ModalWrapper>
);

Modal.defaultProps = {
  children: null,
  // setting default value for non-exposed prop: should not be visible; just for testing purposes
  disablePortal: process.env.NODE_ENV === 'test', // eslint-disable-line react/default-props-match-prop-types
  onClose: null,
};

Modal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  title: PropTypes.string.isRequired,
};

export default Modal;
