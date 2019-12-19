import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Media from 'react-media';

import { svg, Logout as LogoutIcon } from '@datapunt/asc-assets';
import {
  Header as HeaderComponent,
  MenuFlyOut,
  MenuButton,
  MenuInline,
  MenuItem,
  MenuToggle,
  themeColor,
} from '@datapunt/asc-ui';
import SearchBar from 'containers/SearchBar';
import { isAuthenticated } from 'shared/services/auth/auth';
import useIsFrontOffice from 'hooks/useIsFrontOffice';
import Notification from 'containers/Notification';

export const breakpoint = 1100;

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
  color: ${themeColor('tint', 'level6')};
`;

const StyledMenuFlyout = styled(MenuFlyOut)`
  & span,
  & button {
    font-family: inherit;
    font-weight: normal;
    font-size: 16px;
    font-weight: normal;
    color: ${themeColor('tint', 'level6')};
  }
`;

const SearchBarMenuItem = styled(MenuItem)`
  margin-right: 0;
  max-width: 365px;

  @media screen and (min-width: ${breakpoint + 1}px) {
    margin-right: auto;
    flex-basis: 365px;
  }
`;

const StyledSearchBar = styled(SearchBar)`
  margin-top: 5px;
`;

const HeaderWrapper = styled.div`
  ${({ tall }) =>
    !tall &&
    css`
      #header {
        left: 0;
        right: 0;
        position: fixed;
      }
    `}

  ${({ isFrontOffice, tall }) =>
    isFrontOffice &&
    tall &&
    css`
      z-index: 1;

      #header {
        position: static;

        header {
          height: 160px;
        }

        @media screen and (max-width: 539px) {
          header {
            height: 116px;
          }
        }

        &:after {
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          content: '';
          display: block;
          position: absolute;
          left: 0;
          right: 0;
          height: 44px;
          margin-top: -44px;
          background-color: ${themeColor('tint', 'level2')};
          width: 100%;
        }

        nav,
        ul {
          margin: 0;
        }

        > header {
          flex-wrap: wrap;
        }

        h1 {
          padding: 15px 0;

          @media screen and (max-width: 990px) {
            margin: 0;
          }

          a {
            height: 68px;

            span {
              background-repeat: no-repeat;
              background-size: auto 100%;
            }

            @media screen and (max-width: 539px) {
              height: 41px;
            }
          }
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

const MenuItems = ({ onLogOut, show }) => {
  const showLogout = isAuthenticated();

  return (
    <Fragment>
      {isAuthenticated() && (
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

      {show.defaultTexts && (
        <MenuItem element="span">
          <StyledMenuButton $as={NavLink} to="/manage/standaard/teksten">
            Standaard teksten
          </StyledMenuButton>
        </MenuItem>
      )}

      {show.settings && (
        <StyledMenuFlyout label="Instellingen">
          {show.users && (
            <StyledMenuButton $as={NavLink} to="/instellingen/gebruikers">
              Gebruikers
            </StyledMenuButton>
          )}

          {show.groups && (
            <StyledMenuButton $as={NavLink} to="/instellingen/rollen">
              Rollen
            </StyledMenuButton>
          )}
        </StyledMenuFlyout>
      )}

      {showLogout && (
        <MenuItem
          element="button"
          data-testid="logout-button"
          onClick={onLogOut}
        >
          <StyledMenuButton
            iconSize={16}
            iconLeft={<LogoutIcon focusable="false" />}
          >
            Uitloggen
          </StyledMenuButton>
        </MenuItem>
      )}
    </Fragment>
  );
};

export const SiteHeader = props => {
  const isFrontOffice = useIsFrontOffice();
  const tall = isFrontOffice && !isAuthenticated();
  const title = tall ? '' : 'SIA';

  const navigation = useMemo(
    () => (
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
    ),
    [props]
  );

  return (
    <Fragment>
      <HeaderWrapper
        isFrontOffice={isFrontOffice}
        tall={tall}
        className={`siteHeader ${tall ? 'isTall' : 'isShort'}`}
        data-testid="siteHeader"
      >
        <StyledHeader
          isFrontOffice={isFrontOffice}
          title={title}
          homeLink="/"
          tall={tall}
          fullWidth={false}
          navigation={tall ? null : navigation}
        />
        {!tall && <Notification />}
      </HeaderWrapper>

      {tall && <Notification />}
    </Fragment>
  );
};

SiteHeader.defaultProps = {
  onLogOut: undefined,
};

SiteHeader.propTypes = {
  onLogOut: PropTypes.func,
  show: PropTypes.shape({}),
};

MenuItems.propTypes = SiteHeader.propTypes;

export default SiteHeader;
