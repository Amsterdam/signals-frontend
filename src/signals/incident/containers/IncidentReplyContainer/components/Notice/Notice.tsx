import { FunctionComponent } from 'react'
import {
  Column,
  Heading,
  Paragraph,
  Row,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

interface PageProps {
  title: string
  content: string
}

export const Content = styled.div`
  flex-direction: column;
`

export const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(10)};
  margin-bottom: ${themeSpacing(5)};
`

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
