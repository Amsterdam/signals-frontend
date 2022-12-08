/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { Paragraph as AscParagraph, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const Paragraph = styled(AscParagraph)<{ light?: boolean }>`
  font-size: inherit;
  margin-bottom: 0;
  color: ${({ light = false }) =>
    light ? themeColor('tint', 'level5') : themeColor('tint', 'level7')};
`

export default Paragraph
