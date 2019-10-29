import React from 'react';
import styled from 'styled-components';
import { styles } from '@datapunt/asc-ui';

const { InputStyle } = styles;

const TextArea = props => <InputStyle as="textarea" {...props} />;

const StyledArea = styled(TextArea)`
  font-family: inherit;
`;

export default StyledArea;
