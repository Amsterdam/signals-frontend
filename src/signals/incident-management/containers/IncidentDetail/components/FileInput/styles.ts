// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'

export const FileInputStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${themeSpacing(2)};
`

export const FileInputUploadButton = styled.div`
  input[type='file'] {
    opacity: 0;
    width: 0;
    height: 0;
  }

  & > label {
    cursor: pointer;
  }
`
