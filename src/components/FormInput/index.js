import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  Label as FieldLabel,
  styles,
  themeColor,
  themeSpacing,
  Typography,
} from '@datapunt/asc-ui';

import Hint from '../Hint';

const StyledInput = styled.input`
  ${styles.InputStyle.componentStyle.rules}
  font-family: inherit;
  font-size: 16px;
  line-height: 22px;

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
  $as: 'h6',
})`
  color: ${themeColor('secondary')};
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: normal;
  margin: ${themeSpacing(2)} 0;
`;

const Label = styled(FieldLabel)`
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

const FormInput = ({ className, hint, label, id, error, ...rest }) => (
  <Wrapper className={className} showError={Boolean(error)}>
    {label && <Label hasHint={Boolean(hint)} htmlFor={id} label={label} />}
    {hint && <Hint>{hint}</Hint>}
    {error && <Error>{error}</Error>}
    <StyledInput id={id} showError={Boolean(error)} {...rest} />
  </Wrapper>
);

FormInput.defaultProps = {
  className: '',
  error: '',
  hint: '',
  id: '',
  label: '',
};

FormInput.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};

export default FormInput;
