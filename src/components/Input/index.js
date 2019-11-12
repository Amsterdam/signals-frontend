import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  Input as Field,
  Label as FieldLabel,
  styles,
  themeColor,
  Typography,
  themeSpacing,
} from '@datapunt/asc-ui';

const StyledInput = styled(Field)`
  ${styles.Input}

  &[disabled] {
    border: 1px solid ${themeColor('tint', 'level4')};
    color: ${themeColor('tint', 'level4')};
  }
`;

const Hint = styled(Typography).attrs({
  $as: 'span',
})`
  color: ${themeColor('tint', 'level4')};
  display: block;
  margin-bottom: ${themeSpacing(2)};
`;

export const Label = styled(FieldLabel)`
  display: block;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  ${({ hasHint }) =>
    !hasHint &&
    css`
      margin-bottom: ${themeSpacing(2)};
    `}
`;

const Input = ({ hint, label, id, ...rest }) => (
  <Fragment>
    {label && <Label hasHint={Boolean(hint)} htmlFor={id} label={label} />}
    {hint && <Hint>{hint}</Hint>}
    <StyledInput id={id} {...rest} />
  </Fragment>
);

Input.defaultProps = {
  className: '',
  hint: '',
  id: '',
  label: '',
};

Input.propTypes = {
  className: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};

export default Input;
