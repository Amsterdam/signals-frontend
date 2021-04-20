// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  Link as AscLink,
  Icon,
  Typography,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { ChevronLeft } from '@amsterdam/asc-assets'

const LinkLabel = styled(Typography).attrs({
  forwardedAs: 'span',
})`
  font-size: 16px;
  color: ${themeColor('primary')};
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
`

const Chevron = styled(ChevronLeft)`
  display: inline-block;
`

const StyledLink = styled(AscLink)`
  &:hover {
    * {
      color: ${themeColor('secondary')};
    }

    path {
      fill: ${themeColor('secondary')} !important;
    }

    text-decoration: none;
  }
`

const StyledIcon = styled(Icon)`
  margin: 0 ${themeSpacing(2)} 0 0 !important;
  display: inline-block;

  svg > path {
    fill: ${themeColor('primary')} !important;
  }
`

/**
 * Component that renders a Link with a left chevron
 * To be used on detail pages for navigating back to its corresponding overview page
 */
const BackLink = ({ className, children, to }) => (
  <StyledLink
    className={className}
    forwardedAs={Link}
    to={to}
    data-testid="backlink"
  >
    <StyledIcon size={12}>
      <Chevron />
    </StyledIcon>
    <LinkLabel>{children}</LinkLabel>
  </StyledLink>
)

BackLink.defaultProps = {
  className: '',
}

BackLink.propTypes = {
  /** The BackLink label contents */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /** Route indicator */
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string,
      state: PropTypes.shape({}),
    }),
  ]).isRequired,
}

export default BackLink
