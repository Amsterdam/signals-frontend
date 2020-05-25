import React, { Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles, themeColor, themeSpacing } from '@datapunt/asc-ui';

const { InputStyle } = styles;

const ForwardedRefTextArea = forwardRef((props, ref) => <textarea {...props} ref={ref} />);

const StyledArea = styled(ForwardedRefTextArea)`
  ${InputStyle.componentStyle.rules}
  font-family: inherit;
  vertical-align: top; /* https://stackoverflow.com/questions/7144843/extra-space-under-textarea-differs-along-browsers */
  min-height: 95px;
`;

const HelpText = styled.div`
  color: ${themeColor('tint', 'level5')};
  margin-top: ${themeSpacing(2)};
`;

const TextArea = ({ helpText, ...props }) => (
  <Fragment>
    <StyledArea {...props} />
    {helpText && <HelpText>{helpText}</HelpText>}
  </Fragment>
);

TextArea.propTypes = {
  helpText: PropTypes.node,
};

export default TextArea;
