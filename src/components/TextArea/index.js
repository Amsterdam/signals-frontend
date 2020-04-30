import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { styles } from '@datapunt/asc-ui';

const { InputStyle } = styles;

const TextArea = forwardRef((props, ref) => <textarea {...props} ref={ref} />);


const StyledArea = styled(TextArea)`
  ${InputStyle.componentStyle.rules}
  font-family: inherit;
  vertical-align: top; /* https://stackoverflow.com/questions/7144843/extra-space-under-textarea-differs-along-browsers */
`;

export default StyledArea;
