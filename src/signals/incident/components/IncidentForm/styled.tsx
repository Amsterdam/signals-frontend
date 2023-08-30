// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import styled from 'styled-components'

export const Form = styled.form`
  width: 100%;
`

export const ProgressContainer = styled.div``

export const ControlsWrapper = styled.div<{ isSummary?: boolean }>`
  border: 0;
  padding: 0;
  margin: 0;
  word-break: normal;
  display: grid;
  row-gap: 32px;
`
