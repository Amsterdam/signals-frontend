import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Link as AscLink, Icon, Typography, themeColor } from '@datapunt/asc-ui';
import { ChevronLeft } from '@datapunt/asc-assets';

const LinkLabel = styled(Typography).attrs({
  $as: 'span',
})`
  font-size: 16px;
  color: ${themeColor('primary')};
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
`;

const Chevron = styled(ChevronLeft)`
  & path {
    fill: ${themeColor('primary')} !important;
  }

  :hover & path {
    fill: ${themeColor('secondary')};
  }
`;

const StyledLink = styled(AscLink)`
  &:hover {
    &, span {
      color: ${themeColor('secondary')};
    }

    path {
      fill: ${themeColor('secondary')};
    }

    text-decoration: none;
  }
`;

/**
 * Component that renders a Link with a left chevron
 * To be used on detail pages for navigating back to its corresponding overview page
 */
const BackLink = ({ className, children, to }) => (
  <StyledLink className={className} $as={Link} to={to}>
    <Icon size={12}>
      <Chevron fill="blue" />
    </Icon>
    <LinkLabel>{children}</LinkLabel>
  </StyledLink>
);

BackLink.defaultProps = {
  className: '',
};

BackLink.propTypes = {
  /** The BackLink label */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /** Route indicator */
  to: PropTypes.string.isRequired,
};

export default BackLink;
