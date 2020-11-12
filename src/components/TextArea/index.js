import React, { Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles, themeColor, themeSpacing } from '@amsterdam/asc-ui';

import Label from 'components/Label';

import ErrorMessage from '../ErrorMessage';

const { InputStyle } = styles;
const lineHeight = 22;

const StyledArea = styled.textarea`
  ${InputStyle.componentStyle.rules}
  font-family: inherit;
  vertical-align: top; /* https://stackoverflow.com/questions/7144843/extra-space-under-textarea-differs-along-browsers */
  min-height: ${({ rows }) => (rows || 5) * lineHeight}px;
  resize: vertical;
  max-height: ${({ maxRows }) => maxRows * lineHeight}px;
  line-height: ${lineHeight}px;
  box-sizing: content-box;
  max-width: calc(100% - 18px);
`;

const HelpText = styled.div`
  color: ${themeColor('tint', 'level5')};
  margin-top: ${themeSpacing(2)};
`;

const TextArea = forwardRef(({ helpText, errorMessage, label, id, ...props }, ref) => (
  <Fragment>
    <Label inline htmlFor={id}>
      {label}
    </Label>
    <StyledArea id={id} {...props} ref={ref} />
    {helpText && <HelpText>{helpText}</HelpText>}
    {errorMessage && <ErrorMessage message={errorMessage} />}
  </Fragment>
));

TextArea.defaultProps = {
  maxRows: 15,
};

TextArea.propTypes = {
  id: PropTypes.string,
  helpText: PropTypes.node,
  label: PropTypes.node,
  errorMessage: PropTypes.string,
  maxRows: PropTypes.number,
};

export default TextArea;
