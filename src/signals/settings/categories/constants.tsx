// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Fragment } from 'react'

import { StyledInfo } from './components/styled'

export const ICONEXAMPLE = [
  <Fragment key={'IconExample'}>
    <StyledInfo>Voorbeeld van een icoon:</StyledInfo>
    <img alt={'example-of-an-icon'} src={'/assets/images/afval/rest.svg'} />
  </Fragment>,
]
