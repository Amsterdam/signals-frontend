import React from 'react';
import styled from 'styled-components';
import { styles } from '@datapunt/asc-ui';

const { InputStyle } = styles;

const TextArea = props => <textarea {...props} />;

const StyledArea = styled(TextArea)`
  ${InputStyle.componentStyle.rules}
  font-family: inherit;
`;

export default StyledArea;
