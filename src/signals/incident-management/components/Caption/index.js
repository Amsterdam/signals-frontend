import React from 'react';
import styled from 'styled-components';

const StyledSpan = styled.span`
  font-size: 16px;
  color: #767676;
  line-height: 22px;
`;

const Caption = (props) => <StyledSpan {...props} />;

export default Caption;
