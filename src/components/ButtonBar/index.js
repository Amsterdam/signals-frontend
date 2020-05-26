import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

const Bar = styled.div`
  & > * + * {
    margin-left: ${themeSpacing(2)};
  }
`;

/**
 * Button container that merely adds margin between children
 */
const ButtonBar = ({ className, children }) => <Bar className={className}>{children}</Bar>;

ButtonBar.defaultProps = {
  className: '',
};

ButtonBar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ButtonBar;
