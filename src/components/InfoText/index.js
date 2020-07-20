import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, Paragraph, themeSpacing } from '@datapunt/asc-ui';

const Info = styled(Paragraph)`
  color: ${themeColor('tint', 'level5')};
  margin: ${themeSpacing(2, 0, 6)};
  font-size: 16px;
`;

const InfoText = ({ text }) => <Info data-testid="infoText">{text}</Info>;

InfoText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default InfoText;
