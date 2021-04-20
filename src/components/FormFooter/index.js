// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Row, Column, themeColor } from '@amsterdam/asc-ui'
import Button from 'components/Button'

export const FORM_FOOTER_HEIGHT = 66

export const FooterWrapper = styled.footer`
  background: ${themeColor('tint', 'level1')};
  height: ${FORM_FOOTER_HEIGHT}px;
  padding: 10px 0;
  max-width: 1400px;

  ${({ inline }) =>
    !inline &&
    css`
      border-top: 2px solid #e6e6e6;
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 50%;
      transform: translate(-50%);
      z-index: 1;
    `}
`

export const ButtonContainer = styled(Column)`
  justify-content: flex-start;
`

const StyledButton = styled(Button)`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
`

export const SubmitButton = styled(StyledButton).attrs({
  color: 'secondary',
})`
  margin-right: 15px;
`

export const ResetButton = styled(StyledButton)`
  background-color: ${themeColor('tint', 'level1')};
  margin-right: auto;
`

export const CancelButton = styled(StyledButton).attrs({
  color: 'bright',
})`
  background-color: #b4b4b4;
`

const FormFooter = ({
  cancelBtnLabel,
  className,
  inline,
  onCancel,
  onResetForm,
  onSubmitForm,
  canSubmitForm,
  resetBtnLabel,
  submitBtnLabel,
}) => (
  <FooterWrapper data-testid="formFooter" className={className} inline={inline}>
    <Row hasMargin={!inline}>
      <ButtonContainer span={12}>
        {resetBtnLabel && (
          <ResetButton
            data-testid="resetBtn"
            onClick={onResetForm}
            type="reset"
          >
            {resetBtnLabel}
          </ResetButton>
        )}

        {submitBtnLabel && (
          <SubmitButton
            data-testid="submitBtn"
            name="submit_button"
            disabled={!canSubmitForm}
            onClick={onSubmitForm}
            type="submit"
          >
            {submitBtnLabel}
          </SubmitButton>
        )}

        {cancelBtnLabel && (
          <CancelButton
            data-testid="cancelBtn"
            onClick={onCancel}
            type="button"
          >
            {cancelBtnLabel}
          </CancelButton>
        )}
      </ButtonContainer>
    </Row>
  </FooterWrapper>
)

FormFooter.defaultProps = {
  cancelBtnLabel: '',
  className: '',
  inline: false,
  onCancel: null,
  onResetForm: null,
  onSubmitForm: null,
  canSubmitForm: true,
  resetBtnLabel: '',
  submitBtnLabel: '',
}

FormFooter.propTypes = {
  cancelBtnLabel: PropTypes.string,
  className: PropTypes.string,
  /** When true, the component is positioned relative without borders or padding */
  inline: PropTypes.bool,
  onCancel: PropTypes.func,
  onResetForm: PropTypes.func,
  onSubmitForm: PropTypes.func,
  canSubmitForm: PropTypes.bool,
  resetBtnLabel: PropTypes.string,
  submitBtnLabel: PropTypes.string,
}

export default FormFooter
