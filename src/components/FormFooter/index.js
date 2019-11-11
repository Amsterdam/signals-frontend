import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Button, Column, themeColor } from '@datapunt/asc-ui';

export const FooterWrapper = styled.footer`
  border-top: 2px solid #e6e6e6;
  background: ${themeColor('tint', 'level1')};
  height: 66px;
  padding: 10px 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
`;

export const ButtonContainer = styled(Column)`
  justify-content: flex-start;
`;

const StyledButton = styled(Button)`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
`;

export const SubmitButton = styled(StyledButton).attrs({
  color: 'secondary',
})`
`;

export const ResetButton = styled(StyledButton)`
  background-color: ${themeColor('tint', 'level1')};
  margin-right: auto;
`;

export const CancelButton = styled(StyledButton).attrs({
  color: 'bright',
})`
  margin-right: 15px;
  background-color: #b4b4b4;
`;

const FormFooter = ({
  cancelBtnLabel,
  className,
  onCancel,
  onResetForm,
  onSubmitForm,
  resetBtnLabel,
  submitBtnLabel,
}) => (
  <FooterWrapper className={className}>
    <Row>
      <ButtonContainer span={12}>
        {onResetForm && resetBtnLabel && (
          <ResetButton
            data-testid="resetBtn"
            onClick={onResetForm}
            type="reset"
          >
            {resetBtnLabel}
          </ResetButton>
        )}

        {onCancel && cancelBtnLabel && (
          <CancelButton
            data-testid="cancelBtn"
            onClick={onCancel}
            type="button"
          >
            {cancelBtnLabel}
          </CancelButton>
        )}

        {onSubmitForm && submitBtnLabel && (
          <SubmitButton
            data-testid="submitBtn"
            name="submit_button"
            onClick={onSubmitForm}
            type="submit"
          >
            {submitBtnLabel}
          </SubmitButton>
        )}
      </ButtonContainer>
    </Row>
  </FooterWrapper>
);

FormFooter.defaultProps = {
  cancelBtnLabel: '',
  className: '',
  onCancel: undefined,
  onResetForm: undefined,
  onSubmitForm: undefined,
  resetBtnLabel: '',
  submitBtnLabel: '',
};

FormFooter.propTypes = {
  cancelBtnLabel: PropTypes.string,
  className: PropTypes.string,
  onCancel: PropTypes.func,
  onResetForm: PropTypes.func,
  onSubmitForm: PropTypes.func,
  resetBtnLabel: PropTypes.string,
  submitBtnLabel: PropTypes.string,
};

export default FormFooter;
