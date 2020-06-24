import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import configuration from 'shared/services/configuration/configuration';

const { width, smallWidth, height, smallHeight } = configuration.logo;

const StyledLogo = styled.img`
  width: ${props => props.tall === true ? width : smallWidth};
  height: ${props => props.tall === true ? height : smallHeight};
  max-height: ${props => props.tall === true ? '56px' : '32px'};
`;

export const Logo = ({ tall, ... props }) => (
  <a href={tall ? configuration.links.home : '/'}>
    <StyledLogo alt="Logo" tall={tall} src={configuration.logo.url} {...props} />
  </a>
);

Logo.defaultProps = {
  tall: true,
};

Logo.propTypes = {
  tall: PropTypes.bool,
};

export default Logo;
