// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled from 'styled-components'

export const FileInputStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const FileInputUploadButton = styled.div`
  input[type='file'] {
    display: none;
    opacity: 0;
    width: 0;
    height: 0;
  }

  & > label {
    cursor: pointer;
  }
`
