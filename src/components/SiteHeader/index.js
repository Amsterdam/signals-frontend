import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Media from 'react-media';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { svg, Logout as LogoutIcon } from '@datapunt/asc-assets';
import { Header as HeaderComponent, MenuButton, MenuInline, MenuItem, MenuToggle } from '@datapunt/asc-ui';
import SearchBar from 'containers/SearchBar';

export const breakpoint = 899;

const StyledHeader = styled(HeaderComponent)`
  a:link {
    text-decoration: none;
  }

  ${({ isFrontOffice, tall }) =>
    isFrontOffice &&
    tall &&
    css`
      & {
        max-width: 960px;

        h1 {
          margin-left: -20px;
        }

        h1 a {
          &,
          span {
            width: 153px;
          }
        }

        h1 a span {
          background-image: url(${svg.LogoShort}) !important;
        }
      }
    `}

  nav {
    width: 100%;

    ul {
      width: 100%;
    }
  }
`;

const StyledMenuButton = styled(MenuButton)`
  background: transparent;
  font-size: 16px;
  font-family: inherit;
  color: #323232;
`;

const SearchBarMenuItem = styled(MenuItem)`
  margin-right: auto;
  max-width: 365px;
  flex-basis: 365px;
`;

const StyledSearchBar = styled(SearchBar)`
  margin-top: 5px;
`;

const HeaderWrapper = styled.div`
  ${({ isFrontOffice, tall }) =>
    isFrontOffice &&
    tall &&
    css`
      #header {
        position: static;

        &:after {
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        nav,
        ul {
          margin: 0;
        }

        nav ul {
          justify-content: space-between;

          a {
            font-family: avenir next w01, arial, sans-serif;
            font-size: 18px;
            padding-left: 0;
          }
        }
      }
    `}
`;

const MenuItems = ({ isAuthenticated, onLoginLogoutButtonClick, permissions }) => {
  const showLogout = isAuthenticated;

  return (
    <Fragment>
      {isAuthenticated && (
        <Fragment>
          <SearchBarMenuItem>
            <StyledSearchBar />
          </SearchBarMenuItem>

          <MenuItem element="span">
            <StyledMenuButton $as={NavLink} to="/manage/incidents">
              Afhandelen
            </StyledMenuButton>
          </MenuItem>
        </Fragment>
      )}
      <MenuItem element="span">
        <StyledMenuButton $as={NavLink} to="/">
          Melden
        </StyledMenuButton>
      </MenuItem>
      {permissions.includes('signals.sia_statusmessagetemplate_write') && (
        <MenuItem element="span">
          <StyledMenuButton $as={NavLink} to="/manage/standaard/teksten">
            Standaard teksten
          </StyledMenuButton>
        </MenuItem>
      )}
      {showLogout && (
        <MenuItem element="button" data-testid="logout-button" onClick={onLoginLogoutButtonClick}>
          <StyledMenuButton iconSize={16} iconLeft={<LogoutIcon focusable="false" />}>
            Uitloggen
          </StyledMenuButton>
        </MenuItem>
      )}
    </Fragment>
  );
};

export const SiteHeader = props => {
  const { location, isAuthenticated } = props;
  const isFrontOffice = !location.pathname.startsWith('/manage/');
  const tall = isFrontOffice && !isAuthenticated;
  const title = tall ? '' : 'SIA';

  return (
    <HeaderWrapper isFrontOffice={isFrontOffice} tall={tall} className={`siteHeader ${tall ? 'isTall' : 'isShort'}`}>
      <StyledHeader
        isFrontOffice={isFrontOffice}
        title={title}
        homeLink={CONFIGURATION.ROOT}
        tall={tall}
        fullWidth={false}
        navigation={
          <Media query={`(max-width: ${breakpoint}px)`}>
            {matches =>
              matches ? (
                <MenuToggle align="right">
                  <MenuItems {...props} />
                </MenuToggle>
              ) : (
                <MenuInline>
                  <MenuItems {...props} />
                </MenuInline>
              )
            }
          </Media>
        }
      />
    </HeaderWrapper>
  );
};

SiteHeader.defaultProps = {
  isAuthenticated: false,
  onLoginLogoutButtonClick: undefined,
};

SiteHeader.propTypes = {
  isAuthenticated: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  onLoginLogoutButtonClick: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

MenuItems.propTypes = SiteHeader.propTypes;

const SiteHeaderWithRouter = withRouter(SiteHeader);

export default SiteHeaderWithRouter;
