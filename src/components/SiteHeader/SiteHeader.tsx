// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { useMemo, useState } from 'react'
import type { FunctionComponent } from 'react'

import { MenuInline, MenuToggle } from '@amsterdam/asc-ui'
import { useMediaQuery } from 'react-responsive'

import Logo from 'components/Logo'
import Notification from 'containers/Notification'
import useIsFrontOffice from 'hooks/useIsFrontOffice'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'

import { MenuItems } from './MenuItems'
import { HeaderWrapper, StyledHeader, MENU_BREAKPOINT } from './styled'
import useTallHeader from '../../hooks/useTallHeader'

export interface ShowItems {
  categories: boolean
  defaultTexts: boolean
  departments: boolean
  groups: boolean
  settings: boolean
  users: boolean
}

export interface Props {
  onLogOut?: () => void
  showItems: ShowItems
}

export const SiteHeader = ({ onLogOut, showItems }: Props) => {
  const tallHeaderByDefault = useTallHeader()
  const isFrontOffice = useIsFrontOffice()
  const rendersMenuToggle = useMediaQuery({
    query: `(max-width: ${MENU_BREAKPOINT}px)`,
  })

  const [menuOpen, setMenuOpen] = useState(false)

  const tall = (isFrontOffice && !getIsAuthenticated()) || tallHeaderByDefault
  const title = tall
    ? configuration.language.headerTitle
    : configuration.language.smallHeaderTitle
  const homeLink = tall ? configuration.links.home : '/'
  const logo = Logo as unknown as FunctionComponent

  const navigation = useMemo(
    () =>
      rendersMenuToggle ? (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <MenuToggle align="right" open={menuOpen} onExpand={setMenuOpen}>
          <MenuItems
            onLogOut={onLogOut}
            showItems={showItems}
            onLinkClick={() => setMenuOpen(false)}
          />
        </MenuToggle>
      ) : (
        <MenuInline>
          <MenuItems onLogOut={onLogOut} showItems={showItems} />
        </MenuInline>
      ),
    [rendersMenuToggle, menuOpen, onLogOut, showItems]
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
          logo={logo}
          headerLogoTextAs="div"
        />
        {!tall && <Notification />}
      </HeaderWrapper>

      {tall && <Notification />}
    </>
  )
}
