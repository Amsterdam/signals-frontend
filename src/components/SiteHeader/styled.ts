// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import {
  breakpoint,
  Header as HeaderComponent,
  MenuButton,
  MenuItem,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const MENU_BREAKPOINT = 1320

export const StyledHeader = styled(HeaderComponent)<{
  isFrontOffice: boolean
  tall: boolean
}>`
  nav {
    width: 100%;

    ul {
      width: 100%;
    }
  }
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
`

export const StyledMenuButton = styled(MenuButton)<{ $active: boolean }>`
  background: transparent;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 400;
  color: ${themeColor('tint', 'level6')};

  ${({ $active }) =>
    $active &&
    css`
      span:last-child {
        color: ${themeColor('secondary')};
        border-bottom: 1px solid ${themeColor('secondary')};
      }
    `}
`

export const SearchBarMenuItem = styled(MenuItem)`
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

export const HeaderWrapper = styled.div<{
  isFrontOffice: boolean
  tall: boolean
}>`
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
