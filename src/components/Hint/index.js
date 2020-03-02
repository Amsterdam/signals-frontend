import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, Typography, themeSpacing } from '@datapunt/asc-ui';

const StyledTypography = styled(Typography).attrs({
  $as: 'span',
})`
  color: ${themeColor('tint', 'level5')};
  display: block;
  margin-bottom: ${themeSpacing(2)};
  font-size: 16px;
  line-height: 22px;
`;

const Hint = ({ children }) => <StyledTypography>{children}</StyledTypography>;

Hint.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Hint;
