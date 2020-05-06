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
  themeSpacing,
} from '@datapunt/asc-ui';
import SearchBar from 'containers/SearchBar';
import { isAuthenticated } from 'shared/services/auth/auth';
import useIsFrontOffice from 'hooks/useIsFrontOffice';
import Notification from 'containers/Notification';
import CONFIGURATION from 'shared/services/configuration/configuration';

export const breakpoint = 1170;

const getLogo = config => () =>
  config.logoUrl && (props => <img alt="Logo" src={config.logoUrl} style={{ height: config.logoHeight }} {...props} />);

const StyledHeader = styled(HeaderComponent)`
  a:link {
    font-weight: 400;
    text-decoration: none;
  }
  ${({ isFrontOffice, tall }) =>
    isFrontOffice &&
    tall &&
    css`
      & {
        max-width: 960px;
        h1 {
          margin-left: ${themeSpacing(-5)};
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
  position: relative;

  #header {
    z-index: 2;
  }

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
      #header {
        position: relative;

        header {
          height: 160px;
          z-index: 0;
        }

        @media screen and (max-width: 539px) {
          header {
            height: 50px;
          }

          nav {
            display: none;
          }
        }

        @media screen and (min-width: 540px) {
          z-index: 0;
          box-shadow: none;
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
            margin-top: ${themeSpacing(-11)};
            background-color: ${themeColor('tint', 'level2')};
            width: 100%;
          }
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
              margin-top: -3px;
              height: 29px;
            }
          }
        }
      }
    `}
`;

const MenuItems = ({ onLogOut, showItems }) => {
  const showLogout = isAuthenticated();

  return (
    <Fragment>
      {isAuthenticated() && (
        <Fragment>
          <SearchBarMenuItem>
            <StyledSearchBar />
          </SearchBarMenuItem>

          <MenuItem element="span">
            <StyledMenuButton forwardedAs={NavLink} to="/manage/incidents">
              Afhandelen
            </StyledMenuButton>
          </MenuItem>
        </Fragment>
      )}
      <MenuItem element="span">
        <StyledMenuButton forwardedAs="a" href="/incident/beschrijf">
          Melden
        </StyledMenuButton>
      </MenuItem>

      {showItems.defaultTexts && (
        <MenuItem element="span">
          <StyledMenuButton forwardedAs={NavLink} to="/manage/standaard/teksten">
            Standaard teksten
          </StyledMenuButton>
        </MenuItem>
      )}

      {showItems.settings && (showItems.users || showItems.groups || showItems.departments) && (
        <StyledMenuFlyout label="Instellingen" forwardedAs="span">
          {showItems.users && (
            <StyledMenuButton forwardedAs={NavLink} to="/instellingen/gebruikers">
              Gebruikers
            </StyledMenuButton>
          )}

          {showItems.groups && (
            <StyledMenuButton forwardedAs={NavLink} to="/instellingen/rollen">
              Rollen
            </StyledMenuButton>
          )}

          {showItems.departments && (
            <StyledMenuButton forwardedAs={NavLink} to="/instellingen/afdelingen">
              Afdelingen
            </StyledMenuButton>
          )}

          {showItems.categories && (
            <StyledMenuButton forwardedAs={NavLink} to="/instellingen/categorieen">
              Categorieën
            </StyledMenuButton>
          )}
        </StyledMenuFlyout>
      )}

      {showLogout && (
        <Fragment>
          <MenuItem>
            <StyledMenuButton
              forwardedAs="a"
              href="https://tamtam.amsterdam.nl/do/office?id=1723860-6f6666696365"
              target="_blank"
            >
              Help
            </StyledMenuButton>
          </MenuItem>
          <MenuItem element="button" data-testid="logout-button" onClick={onLogOut}>
            <StyledMenuButton iconSize={16} iconLeft={<LogoutIcon focusable="false" />}>
              Uitloggen
            </StyledMenuButton>
          </MenuItem>
        </Fragment>
      )}
    </Fragment>
  );
};

export const SiteHeader = props => {
  const config = CONFIGURATION.all;
  const isFrontOffice = useIsFrontOffice();
  const tall = isFrontOffice && !isAuthenticated();
  const title = tall ? '' : 'SIA';
  const homeLink = tall ? config.links.home : '/';
  const logo = useMemo(getLogo(config));

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
          homeLink={homeLink}
          tall={tall}
          fullWidth={false}
          navigation={tall ? null : navigation}
          logo={logo}
        />
        {!tall && <Notification />}
      </HeaderWrapper>

      {tall && <Notification />}
    </Fragment>
  );
};

SiteHeader.defaultProps = {
  onLogOut: undefined,
  showItems: {},
};

SiteHeader.propTypes = {
  onLogOut: PropTypes.func,
  showItems: PropTypes.shape({
    users: PropTypes.bool,
    groups: PropTypes.bool,
    departments: PropTypes.bool,
  }),
};

MenuItems.propTypes = SiteHeader.propTypes;

export default SiteHeader;
