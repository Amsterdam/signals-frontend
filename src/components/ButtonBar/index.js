// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@amsterdam/asc-ui';

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
