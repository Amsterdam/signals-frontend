import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Input as AscInput, Label, themeColor, Typography, themeSpacing } from '@amsterdam/asc-ui';

const Hint = styled(Typography).attrs({
  forwardedAs: 'span',
})`
  color: ${themeColor('tint', 'level5')};
  display: block;
  margin-bottom: ${themeSpacing(2)};
  font-size: 16px;
  line-height: 22px;
`;

const StyledInput = styled(AscInput)`
  font-family: inherit;
  font-size: 16px;
  line-height: 22px;
  padding: 10px; /* needed to style the textboxes as according to the design system */

  &[disabled] {
    border: 1px solid ${themeColor('tint', 'level4')};
    color: ${themeColor('tint', 'level4')};
  }

  ${({ showError }) =>
    showError &&
    css`
      & {
        border: 2px solid ${themeColor('secondary')};
      }
    `}
`;

const Error = styled(Typography).attrs({
  forwardedAs: 'h6',
})`
  color: ${themeColor('secondary')};
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: normal;
  margin: ${themeSpacing(2)} 0;
`;

export const StyledLabel = styled(Label)`
  display: block;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  ${({ hasHint }) =>
    !hasHint &&
    css`
      margin-bottom: ${themeSpacing(2)};
    `}
`;

const Wrapper = styled.div`
  ${({ showError }) =>
    showError &&
    css`
      border-left: 2px solid ${themeColor('secondary')};
      padding-left: ${themeSpacing(4)};
    `}
`;

const Input = forwardRef(({ className, hint, label, id, error, ...rest }, ref) => (
  <Wrapper className={className} showError={Boolean(error)}>
    {label && <StyledLabel hasHint={Boolean(hint)} htmlFor={id} label={label} />}
    {hint && <Hint>{hint}</Hint>}
    {error && <Error>{error}</Error>}
    <StyledInput id={id} showError={Boolean(error)} ref={ref} {...rest} />
  </Wrapper>
));

Input.defaultProps = {
  className: '',
  error: '',
  hint: '',
  id: '',
  label: '',
};

Input.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};

export default Input;
