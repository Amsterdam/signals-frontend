import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import Paragraph from 'components/Paragraph'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

interface GraphDescriptionProps {
  title: string
  subtitle: string
  total: number
}

const Title = styled(Heading)`
  /* margin-bottom: 0;
  margin-top: 0; */
`

const Wrapper = styled.section`
  display: flex;
  padding: ${themeSpacing(4)};
  background-color: ${themeColor('tint', 'level3')};
`

const GraphDescription: FunctionComponent<GraphDescriptionProps> = ({
  title,
  subtitle,
  total,
}) => (
  <Wrapper>
    <div>
      <Heading as="h3">{title}</Heading>
      <Paragraph>{subtitle}</Paragraph>
    </div>
    <Heading>{total}</Heading>
  </Wrapper>
)

export default GraphDescription
