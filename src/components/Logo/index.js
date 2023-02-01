// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import configuration from 'shared/services/configuration/configuration'

const StyledLogo = styled.img`
  display: block;
  width: ${({ tall }) =>
    tall ? configuration.logo.width : configuration.logo.smallWidth};
  height: ${({ tall }) =>
    tall ? configuration.logo.height : configuration.logo.smallHeight};

  ${({ tall }) =>
    tall &&
    css`
      @media screen and ${breakpoint('max-width', 'tabletS')} {
        width: ${configuration.logo.smallWidth};
        height: ${configuration.logo.smallHeight};
      }
    `};
`

const StyledA = styled.a`
  display: inline-block;
  width: ${({ tall }) =>
    tall ? configuration.logo.width : configuration.logo.smallWidth};
  height: ${({ tall }) =>
    tall ? configuration.logo.height : configuration.logo.smallHeight};
  margin-right: ${themeSpacing(3)};

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
`

export const Logo = ({ tall, ...props }) => (
  <StyledA
    data-testid="logo-link"
    tall={tall}
    href={tall ? configuration.links.home : '/'}
  >
    <StyledLogo
      data-testid="logo"
      alt={configuration.language.logoDescription}
      tall={tall}
      src={configuration.logo.url}
      {...props}
    />
  </StyledA>
)

Logo.defaultProps = {
  tall: true,
}

Logo.propTypes = {
  tall: PropTypes.bool,
}

export default Logo
