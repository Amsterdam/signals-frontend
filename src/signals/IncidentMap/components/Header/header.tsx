// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Fragment } from 'react'

import {
  Hidden,
  MenuButton as Button,
  MenuItem as Item,
  Heading,
  MenuToggle,
} from '@amsterdam/asc-ui'

import Logo from 'components/Logo'

import { HeaderWrapper, Title } from './styled'

export const Header = () => {
  const MenuItems = () => (
    <Item>
      <Button forwardedAs="a" href="/incident/beschrijf" target="_blank">
        Doe een melding
      </Button>
    </Item>
  )

  const Navigation = () => (
    <Fragment>
      <Hidden minBreakpoint="tabletS">
        <MenuToggle align="right">
          <MenuItems />
        </MenuToggle>
      </Hidden>
      <Hidden maxBreakpoint="tabletS">
        <MenuItems />
      </Hidden>
    </Fragment>
  )

  return (
    <HeaderWrapper>
      <Title>
        <Logo tall={true} />
        <Heading>Meldingenkaart</Heading>
      </Title>
      <Navigation />
    </HeaderWrapper>
  )
}
