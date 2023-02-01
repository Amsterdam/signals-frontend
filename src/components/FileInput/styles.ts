// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { themeColor, themeSpacing, Icon } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'

const FileInputStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${themeSpacing(2)};
`

export const FileInputPreviewBox = styled.div`
  width: ${themeSpacing(25)};
  height: ${themeSpacing(25)};
  margin-right: ${themeSpacing(2)};
`

export const FileInputEmptyBox = styled.div`
  width: ${themeSpacing(25)};
  height: ${themeSpacing(25)};
  border: 1px dashed ${themeColor('tint', 'level5')};
  margin-right: ${themeSpacing(2)};
`

export const FileInputUploadButton = styled(FileInputEmptyBox)`
  input[type='file'] {
    opacity: 0;
    width: 0;
    height: 0;

    &:focus + label {
      outline: 5px auto Highlight; // Firefox outline
      outline: 5px auto -webkit-focus-ring-color; // Safari / Chrome outline
    }
  }

  & > label {
    position: relative;
    display: inline-block;
    cursor: pointer;
    height: 100%;
    width: 100%;
  }
`

export const DeleteButton = styled(Button).attrs(() => ({
  size: 40,
  iconSize: 22,
}))`
  position: absolute;
  width: ${themeSpacing(25)};
  height: 40px;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);

  svg > path {
    fill: ${themeColor('tint', 'level1')};
  }

  &:hover {
    background-color: black;
  }
`

export const AddButton = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${themeSpacing(10)};
  height: ${themeSpacing(10)};
  top: 29px;
  left: 29px;
  border-radius: 50%;
  border: 1px solid ${themeColor('primary')};

  &:hover {
    background-color: ${themeColor('tint', 'level1')};
    border-width: 2px;
    padding: 2px;
  }
`

export const AddIcon = styled(Icon)`
  svg > path {
    fill: ${themeColor('primary')};
  }
`

export const FilePreview = styled.div<{ preview: string }>`
  position: relative;
  background-size: cover;
  height: 100%;
  width: 100%;
  background-image: ${({ preview }) => `URL(${preview})`};
`

export const ScreenReaderOnly = styled.span`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

export const StyledErrorMessage = styled(ErrorMessage)`
  margin-top: ${themeSpacing(1)};
  margin-bottom: ${themeSpacing(3)};
`

export default FileInputStyle
