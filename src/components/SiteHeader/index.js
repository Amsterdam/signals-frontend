// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { useMemo, useState } from 'react'

import { Logout as LogoutIcon } from '@amsterdam/asc-assets'
import {
  Header as HeaderComponent,
  MenuButton,
  MenuInline,
  MenuItem,
  MenuToggle,
  themeColor,
  themeSpacing,
  breakpoint,
} from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { useMediaQuery } from 'react-responsive'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import Logo from 'components/Logo'
import Notification from 'containers/Notification'
import SearchBar from 'containers/SearchBar'
import useIsFrontOffice from 'hooks/useIsFrontOffice'
import useIsIncidentMap from 'hooks/useIsIncidentMap'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'

const MENU_BREAKPOINT = 1320

const StyledHeader = styled(HeaderComponent)`
  ${({ isFrontOffice, tall }) =>
    isFrontOffice &&
    tall &&
    css`
      & {
        max-width: 960px;

        & > div {
          margin-left: ${themeSpacing(-5)};
        }

        @media screen and ${breakpoint('min-width', 'tabletS')} {
          & > div > a {
            &,
            span {
              width: 153px;
            }
          }
        }
      }
    `}

  nav {
    width: 100%;
    ul {
      width: 100%;
    }
  }
`

const StyledMenuButton = styled(MenuButton)`
  background: transparent;
  font-size: 16px;
  font-family: inherit;
  font-weight: 400;
  color: ${themeColor('tint', 'level6')};
`

const SearchBarMenuItem = styled(MenuItem)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 0;
  max-width: 365px;
  @media screen and (min-width: ${MENU_BREAKPOINT + 1}px) {
    margin-right: auto;
    flex-basis: 365px;
  }
`

const HeaderWrapper = styled.div`
  position: relative;

  #header {
    max-width: 1400px;
    z-index: 2;
    contain: layout;
  }

  [aria-hidden='true'] {
    display: none;
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

        & > header {
          flex-wrap: wrap;

          & > div {
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
      }
    `}
`

const MenuItems = ({ onLogOut, showItems, onLinkClick }) => {
  const isAuthenticated = getIsAuthenticated()

  return (
    <>
      {getIsAuthenticated() && (
        <>
          <SearchBarMenuItem>
            <SearchBar />
          </SearchBarMenuItem>

          <MenuItem element="span">
            <StyledMenuButton
              onClick={onLinkClick}
              forwardedAs={NavLink}
              to="/manage/incidents"
            >
              Overzicht
            </StyledMenuButton>
          </MenuItem>
        </>
      )}

      <MenuItem element="span">
        {/* Full page load to trigger refresh of incident form data */}
        <StyledMenuButton
          onClick={onLinkClick}
          forwardedAs="a"
          href="/incident/beschrijf"
        >
          Melden
        </StyledMenuButton>
      </MenuItem>

      {isAuthenticated && (
        <MenuItem element="span">
          <StyledMenuButton
            onClick={onLinkClick}
            forwardedAs={NavLink}
            to="/manage/signalering"
          >
            Signalering
          </StyledMenuButton>
        </MenuItem>
      )}

      {showItems.defaultTexts && (
        <MenuItem element="span">
          <StyledMenuButton
            onClick={onLinkClick}
            forwardedAs={NavLink}
            to="/manage/standaard/teksten"
          >
            Standaard teksten
          </StyledMenuButton>
        </MenuItem>
      )}

      {showItems.settings && (
        <MenuItem element="span">
          <StyledMenuButton
            onClick={onLinkClick}
            forwardedAs={NavLink}
            to="/instellingen/"
          >
            Instellingen
          </StyledMenuButton>
        </MenuItem>
      )}

      {isAuthenticated && (
        <>
          {configuration.links?.help && (
            <MenuItem>
              <StyledMenuButton
                onClick={onLinkClick}
                forwardedAs="a"
                href={configuration.links?.help}
                target="_blank"
              >
                Help
              </StyledMenuButton>
            </MenuItem>
          )}
          <MenuItem
            element="button"
            data-testid="logout-button"
            onClick={() => {
              onLinkClick && onLinkClick()
              onLogOut()
            }}
          >
            <StyledMenuButton
              iconSize={16}
              iconLeft={<LogoutIcon focusable="false" />}
            >
              Uitloggen
            </StyledMenuButton>
          </MenuItem>
        </>
      )}
    </>
  )
}

export const SiteHeader = (props) => {
  const rendersMenuToggle = useMediaQuery({
    query: `(max-width: ${MENU_BREAKPOINT}px)`,
  })
  const isFrontOffice = useIsFrontOffice()
  const isIncidentMap = useIsIncidentMap()
  const tall = isFrontOffice && !getIsAuthenticated()
  const title = tall
    ? configuration.language.headerTitle
    : configuration.language.smallHeaderTitle
  const homeLink = tall ? configuration.links.home : '/'
  const [menuOpen, setMenuOpen] = useState(false)

  const navigation = useMemo(
    () =>
      rendersMenuToggle ? (
        <MenuToggle align="right" open={menuOpen} onExpand={setMenuOpen}>
          <MenuItems {...props} onLinkClick={() => setMenuOpen(false)} />
        </MenuToggle>
      ) : (
        <MenuInline>
          <MenuItems {...props} />
        </MenuInline>
      ),
    [props, menuOpen, rendersMenuToggle]
  )

  if (isIncidentMap) {
    return null
  }

  return (
    <>
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
          logo={Logo}
          headerLogoTextAs="div"
        />
        {!tall && <Notification />}
      </HeaderWrapper>

      {tall && <Notification />}
    </>
  )
}

SiteHeader.defaultProps = {
  onLogOut: undefined,
  showItems: {},
}

SiteHeader.propTypes = {
  onLogOut: PropTypes.func,
  showItems: PropTypes.shape({
    users: PropTypes.bool,
    groups: PropTypes.bool,
    departments: PropTypes.bool,
  }),
}

MenuItems.propTypes = SiteHeader.propTypes

export default SiteHeader
