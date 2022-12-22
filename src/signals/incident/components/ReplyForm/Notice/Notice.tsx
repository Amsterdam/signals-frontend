// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import {
  Column,
  Heading,
  Paragraph,
  Row,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(10)};
  margin-bottom: ${themeSpacing(5)};
`

interface NoticeProps {
  title: string
  content: string
}

const Notice = ({ content, title }: NoticeProps) => (
  <Row>
    <Column span={12}>
      <div>
        <StyledHeading>{title}</StyledHeading>
        <Paragraph>{content}</Paragraph>
      </div>
    </Column>
  </Row>
)

export default Notice
