// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { Spinner as AscSpinner } from '@amsterdam/asc-assets'
import { themeColor } from '@amsterdam/asc-ui'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Spinning = styled(AscSpinner)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  fill: ${({ color }) => color || themeColor('secondary')};
  width: 100px;
  height: 100px;

  & > * {
    transform-origin: 50% 50%;
    animation: ${rotate} 2s linear infinite;
  }
`

const LoadingIndicator = (props) => (
  <Spinning data-testid="loading-indicator" {...props} />
)

export default LoadingIndicator
