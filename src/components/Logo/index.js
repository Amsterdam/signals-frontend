import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { breakpoint, themeSpacing, themeColor } from '@datapunt/asc-ui';

import configuration from 'shared/services/configuration/configuration';

const StyledLogo = styled.img`
  display: block;
  width: ${({ tall }) => (tall ? configuration.logo.width : configuration.logo.smallWidth)};
  height: ${({ tall }) => (tall ? configuration.logo.height : configuration.logo.smallHeight)};

  ${({ tall }) =>
    tall &&
    css`
      @media screen and ${breakpoint('max-width', 'tabletS')} {
        width: ${configuration.logo.smallWidth};
        height: ${configuration.logo.smallHeight};
      }
    `};
`;

const StyledA = styled.a`
  display: inline-block;
  width: ${({ tall }) => (tall ? configuration.logo.width : configuration.logo.smallWidth)};
  height: ${({ tall }) => (tall ? configuration.logo.height : configuration.logo.smallHeight)};
  margin-right: ${themeSpacing(3)};

  &&:focus {
    outline-color: ${themeColor('support', 'focus')};
    outline-style: solid;
    outline-offset: 0px;
    outline-width: 3px;
  }

  ${({ tall }) =>
    tall &&
    css`
      @media screen and ${breakpoint('max-width', 'tabletS')} {
        width: ${configuration.logo.smallWidth};
        height: ${configuration.logo.smallHeight};
      }
      @media screen and ${breakpoint('min-width', 'laptopM')} {
        margin-right: ${themeSpacing(10)};
      }
    `};
`;

export const Logo = ({ tall, ...props }) => (
  <StyledA data-testid="logo-link" tall={tall} href={tall ? configuration.links.home : '/'}>
    <StyledLogo data-testid="logo" alt="Logo" tall={tall} src={configuration.logo.url} {...props} />
  </StyledA>
);

Logo.defaultProps = {
  tall: true,
};

Logo.propTypes = {
  tall: PropTypes.bool,
};

export default Logo;
