// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Heading, themeSpacing, breakpoint } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const StyledH1 = styled(Heading)`
  margin-top: ${themeSpacing(6)};
  margin-bottom: ${themeSpacing(5)};
  letter-spacing: 0.1px;
`

export const Wrapper = styled.div`
  width: 100%;
`
export const Header = styled.header``
export const Progress = styled.div``
export const FormWrapper = styled.div``

export const StepWrapper = styled.article<{ showProgress?: boolean }>`
  display: grid;
  grid-template-areas:
    ${({ showProgress }) => (showProgress ? "'progress'" : '')}
    'header'
    'form';

  grid-column-gap: ${themeSpacing(5)};

  ${Header} {
    grid-area: header;
  }

  ${Progress} {
    padding-top: ${themeSpacing(8)};
    grid-area: progress;
    display: ${({ showProgress }) => (showProgress ? 'block' : 'none')};

    @media screen and ${breakpoint('max-width', 'tabletM')} {
      margin-left: ${themeSpacing(4)};
    }

    li {
      line-height: 20px;
    }
  }

  ${FormWrapper} {
    grid-area: form;
  }

  ${({ showProgress }) =>
    showProgress
      ? css`
          @media screen and ${breakpoint('min-width', 'tabletM')} {
            grid-template-areas:
              'progress header'
              'progress form';
            grid-template-columns: 4fr 8fr;
          }
        `
      : ''};
`
