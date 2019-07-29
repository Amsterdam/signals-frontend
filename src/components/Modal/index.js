import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  Button,
  Row,
  Column,
  Modal as ASCModal,
  Heading,
} from '@datapunt/asc-ui';
import { Close } from '@datapunt/asc-assets';

const StyledModal = styled(ASCModal)`
  > div:last-of-type {
    max-height: 100vh;
    height: 100vh;
    max-width: 1800px;
  }
`;

const ModalInner = styled.div`
  height: calc(100vh - (50px + 66px));
  max-width: 1800px;
  padding-top: 20px;
  padding-bottom: 20px;

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
`;

const Header = styled.header`
  background: white;
  height: 50px;
  padding: 10px 0;
  border-bottom: 2px solid #e6e6e6;
`;

const Footer = styled.footer`
  border-top: 2px solid #e6e6e6;
  background: white;
  height: 66px;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const CloseButton = styled(Button)`
  border: 0;
  background-color: none;
  position: absolute;
  top: 5px;
  right: 0px;
  cursor: pointer;
`;

const ButtonContainer = styled(Column)`
  justify-content: flex-end;
`;

const ResetButton = styled(Button)`
  margin-right: auto;
`;

const CancelButton = styled(Button).attrs({
  color: 'bright',
})`
  margin-right: 10px;
  background-color: #b4b4b4;
`;

const Modal = ({ isOpen, onClose, onReset, onCancel, onSubmit, ...rest }) => (
  <StyledModal data-testid="modal" open={isOpen} backdropOpacity={1} {...rest}>
    <Header>
      <HeaderRow>
        <Column span={12}>
          <Heading as="h2">Filters</Heading>
        </Column>

        <CloseButton
          data-testid="closeBtn"
          square
          type="button"
          as="button"
          onClick={onClose}
        >
          <Close width="20" height="20" fill="#000000" />
        </CloseButton>
      </HeaderRow>
    </Header>

    <ModalInner>
      <Row>
        <Column span={12}>Here be filters</Column>
      </Row>
    </ModalInner>

    <Footer>
      <Row>
        <ButtonContainer span={12}>
          <ResetButton data-testid="resetBtn" type="reset" onClick={onReset}>
            Reset filter
          </ResetButton>

          <CancelButton
            data-testid="cancelBtn"
            type="button"
            onClick={onCancel}
          >
            Annuleren
          </CancelButton>

          <Button
            data-testid="submitBtn"
            type="submit"
            color="secondary"
            onClick={onSubmit}
          >
            Filteren
          </Button>
        </ButtonContainer>
      </Row>
    </Footer>
  </StyledModal>
);

Modal.defaultProps = {
  // setting default value for non-exposed prop: should not be visible; just for testing purposes
  disablePortal: process.env.NODE_ENV === 'test',
  isOpen: false,
  onCancel: null,
  onClose: null,
  onReset: null,
  onSubmit: null,
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Modal;
