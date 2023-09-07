// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import {
  themeSpacing,
  Heading,
  themeColor,
  Button as AscButton,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

import LoadingIndicator from 'components/LoadingIndicator'

import StyledUploadProgress from './UploadProgress'
import AddNote from '../AddNote'

export const Wrapper = styled.section`
  contain: content;
  position: relative;
  z-index: 0;
`

export const StyledButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${themeSpacing(8)};
  gap: ${themeSpacing(2)};
`

export const Title = styled(Heading)`
  margin: ${themeSpacing(4)} 0;
`

export const StyledBox = styled.div`
  position: relative;
  display: inline-block;
  margin-right: ${themeSpacing(2)};
  margin-bottom: ${themeSpacing(2)};
  width: ${themeSpacing(50)};
  height: 135px;
  border: 1px solid ${themeColor('tint', 'level3')} !important;
  cursor: pointer;
`

export const StyledBoxContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  padding: 10px 10px 7px;
  grid-template:
    'tags . tools' 26px
    '. . .' 1fr
    'details details details' min-content
    / min-content 1fr min-content;
  gap: 10px;
`

export const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
export const StyledPdfImg = styled.img`
  width: 100%;
  height: 100%;
  padding: 15px 0 65px 0;
  color: black;
  background-color: ${themeColor('tint', 'level3')};
`

export const StyledGradient = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0) 75%
  );
`

export const StyledReporter = styled.div`
  grid-area: tags;
  padding: ${themeSpacing(1.5, 2)};
  background-color: ${themeColor('tint', 'level7')}b3;
  color: ${themeColor('tint', 'level1')};
  font-size: 0.875rem;
  line-height: 14px;
  font-weight: bold;
  text-transform: uppercase;
`

export const StyledDetails = styled.div<{ isPdf?: boolean }>`
  color: ${({ isPdf }) =>
    isPdf ? themeColor('tint', 'level7') : themeColor('tint', 'level1')};
  grid-area: details;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-size: 0.875rem;
  line-height: ${themeSpacing(5)};
`

export const StyledDate = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StyledError = styled(StyledDate)`
  padding: 0 ${themeSpacing(1)};
  border-radius: ${themeSpacing(0.5)};
  background-color: ${themeColor('error')};
`

export const StyledEmployee = StyledDate

export const StyledName = styled(StyledDate)`
  font-weight: bold;
`
export const StyledButton = styled(AscButton)`
  padding: ${themeSpacing(0, 1.5)};
`

export const StyledButtonsWrapper = styled.div`
  display: flex;
  grid-area: tools;
  & > *:not(:first-child) {
    margin-left: ${themeSpacing(2)};
  }
`

export const StyledUploadProgressError = styled(StyledUploadProgress)`
  &::after {
    background-color: ${themeColor('error')};
  }
`

export const StyledLoadingIndicator = styled(LoadingIndicator)`
  width: 50px;
  height: 50px;
`

export const StyledAddNote = styled(AddNote)`
  margin-top: ${themeSpacing(8)};
`

export const EditAttachmentWrapper = styled.div`
  padding: ${themeSpacing(5)};
  background-color: ${themeColor('tint', 'level2')};
  width: 429px;

  // margin 0 on StyledBox within EditAttachmentWrapper
  & > ${StyledBox} {
    margin: 0;
  }
`

export const StyledH2 = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};
  margin-top: ${themeSpacing(0)};
`

export const StyledForm = styled.form`
  display: grid;
  grid-gap: ${themeSpacing(6)};
  margin-top: ${themeSpacing(4)};
`

export const ButtonsWrapper = styled.div`
  display: flex;
  & > *:not(:first-child) {
    margin-left: ${themeSpacing(2)};
  }
`
