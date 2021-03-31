// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, Paragraph, themeSpacing } from '@amsterdam/asc-ui';

const Info = styled(Paragraph)`
  color: ${themeColor('tint', 'level5')};
  margin: ${themeSpacing(2, 0, 6)};
  font-size: 16px;
`;

const InfoText = ({ className, text, ...rest }) => <Info className={className} data-testid="infoText" {...rest}>{text}</Info>;

InfoText.defaultProps = {
  className: '',
};

InfoText.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default InfoText;
