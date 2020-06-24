import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import configuration from 'shared/services/configuration/configuration';

const StyledLogo = styled.img`
  width: ${props => props.tall === true ? configuration.logo.width : configuration.logo.smallWidth};
  height: ${props => props.tall === true ? configuration.logo.height : configuration.logo.smallHeight};
  max-height: ${props => props.tall === true ? '56px' : '32px'};
`;

export const Logo = ({ tall, ... props }) => (
  <a href={tall ? configuration.links.home : '/'}>
    <StyledLogo data-testid="logo" alt="Logo" tall={tall} src={configuration.logo.url} {...props} />
  </a>
);

Logo.defaultProps = {
  tall: true,
};

Logo.propTypes = {
  tall: PropTypes.bool,
};

export default Logo;
