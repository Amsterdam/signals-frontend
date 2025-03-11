// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import {
  Column,
  Heading,
  Link,
  Paragraph,
  Row,
  themeSpacing,
} from '@amsterdam/asc-ui'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(10)};
  margin-bottom: ${themeSpacing(5)};
`

const Wrapper = styled.div`
  a,
  p {
    font-size: 1rem;
    line-height: 1.5rem;
  }
`

interface NoticeProps {
  title: string
  content: string
}

const Notice = ({ content, title }: NoticeProps) => (
  <Row>
    <Column span={8}>
      <Wrapper>
        <StyledHeading>{title}</StyledHeading>
        <ReactMarkdown
          skipHtml
          allowedElements={['a', 'p']}
          components={{
            a: ({ node, ...props }) => <Link variant="inline" {...props} />,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            p: ({ node, color, ...props }) => <Paragraph {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </Wrapper>
    </Column>
  </Row>
)

export default Notice
