// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import {
  // Hidden,
  MenuButton as Button,
  MenuItem as Item,
  Heading,
  MenuToggle,
} from '@amsterdam/asc-ui'
import { useMediaQuery } from 'react-responsive'

import Logo from 'components/Logo'

import { MENU_BREAKPOINT } from './constants'
import { HeaderWrapper, Title } from './styled'

export const Header = () => {
  const rendersMenuToggle = useMediaQuery({
    query: `(max-width: ${MENU_BREAKPOINT}px)`,
  })

  const MenuItems = () => (
    <Item>
      <Button forwardedAs="a" href="/incident/beschrijf" target="_blank">
        Doe een melding
      </Button>
    </Item>
  )

  const Navigation = () => {
    if (rendersMenuToggle) {
      return (
        <MenuToggle align="right">
          <MenuItems />
        </MenuToggle>
      )
    }

    return <MenuItems />
  }

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
