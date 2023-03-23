// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { useEffect, useMemo, useState } from 'react'

import { Logout as LogoutIcon } from '@amsterdam/asc-assets'
import { MenuInline, MenuItem, MenuToggle } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { useMediaQuery } from 'react-responsive'
import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import Logo from 'components/Logo'
import Notification from 'containers/Notification'
import SearchBar from 'containers/SearchBar'
import useIsFrontOffice from 'hooks/useIsFrontOffice'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'

import {
  HeaderWrapper,
  SearchBarMenuItem,
  StyledHeader,
  StyledMenuButton,
  MENU_BREAKPOINT,
} from './styled'
import useTallHeader from '../../hooks/useTallHeader'

const MenuItems = ({ onLogOut, showItems, onLinkClick }) => {
  const location = useLocation()
  const isAuthenticated = getIsAuthenticated()
  const [activeMenuItem, setActiveMenuItem] = useState('/manage/incidents')

  useEffect(() => {
    setActiveMenuItem(location.pathname)
  }, [location.pathname])

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
              $active={activeMenuItem.includes('/manage/incidents')}
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
          $active={activeMenuItem.includes('/incident/beschrijf')}
        >
          Melden
        </StyledMenuButton>
      </MenuItem>

      {isAuthenticated && configuration.featureFlags.showDashboard ? (
        <MenuItem element="span">
          <StyledMenuButton
            onClick={onLinkClick}
            forwardedAs={NavLink}
            to="/manage/dashboard"
            $active={activeMenuItem.includes('/manage/dashboard')}
          >
            Dashboard
          </StyledMenuButton>
        </MenuItem>
      ) : (
        isAuthenticated && (
          <MenuItem element="span">
            <StyledMenuButton
              onClick={onLinkClick}
              forwardedAs={NavLink}
              to="/manage/signalering"
              $active={activeMenuItem.includes('/manage/signalering')}
            >
              Signalering
            </StyledMenuButton>
          </MenuItem>
        )
      )}

      {showItems.defaultTexts && (
        <MenuItem element="span">
          <StyledMenuButton
            onClick={onLinkClick}
            forwardedAs={NavLink}
            to="/manage/standaard/teksten"
            $active={activeMenuItem.includes('/manage/standaard/teksten')}
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
            $active={activeMenuItem.includes('/instellingen/')}
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

  const tallHeaderByDefault = useTallHeader()
  const isFrontOffice = useIsFrontOffice()
  const tall = (isFrontOffice && !getIsAuthenticated()) || tallHeaderByDefault
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

  return (
    <>
      <HeaderWrapper
        isFrontOffice={isFrontOffice}
        tall={tall}
        className={`siteHeader ${tall ? 'isTall' : 'isShort'}`}
        data-testid="site-header"
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
