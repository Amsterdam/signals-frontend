import React, { Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles, themeColor, themeSpacing } from '@datapunt/asc-ui';

const { InputStyle } = styles;

const StyledArea = styled.textarea`
  ${InputStyle.componentStyle.rules}
  font-family: inherit;
  vertical-align: top; /* https://stackoverflow.com/questions/7144843/extra-space-under-textarea-differs-along-browsers */
  min-height: 5em;
  resize: vertical;
  max-height: 20em;
`;

const HelpText = styled.div`
  color: ${themeColor('tint', 'level5')};
  margin-top: ${themeSpacing(2)};
`;

const TextArea = forwardRef(({ helpText, ...props }, ref) => (
  <Fragment>
    <StyledArea {...props} ref={ref} />
    {helpText && <HelpText>{helpText}</HelpText>}
  </Fragment>
));

TextArea.propTypes = {
  helpText: PropTypes.node,
};

export default TextArea;
