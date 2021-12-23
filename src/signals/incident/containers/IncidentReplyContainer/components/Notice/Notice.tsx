// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { Column, Paragraph, Row } from '@amsterdam/asc-ui'
import { Content, StyledHeading } from '../../styled'

interface PageProps {
  title: string
  content: string
}

const Notice: FunctionComponent<PageProps> = ({ content, title }) => (
  <Row>
    <Column span={12}>
      <Content>
        <StyledHeading>{title}</StyledHeading>
        <Paragraph>{content}</Paragraph>
      </Content>
    </Column>
  </Row>
)

export default Notice
