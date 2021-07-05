import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import Paragraph from 'components/Paragraph'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

const GRAPH_DESCRIPTION_COLOR = themeColor('tint', 'level3')

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: ${themeSpacing(1)};
`

const Title = styled(Heading)`
  font-size: 20px;
  margin-bottom: ${themeSpacing(2)};
  margin-top: 0;
`

const DescriptionWrapper = styled.section`
  display: flex;
  padding: ${themeSpacing(4)};
  background-color: ${GRAPH_DESCRIPTION_COLOR};
`

const Total = styled(Heading)`
  margin-left: ${themeSpacing(12)};
`

const Triangle = styled.div`
  display: flex;
  align-self: center;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 24px solid ${GRAPH_DESCRIPTION_COLOR};
`

interface GraphDescriptionProps {
  title: string
  description: string
  total: number
}

const GraphDescription: FunctionComponent<GraphDescriptionProps> = ({
  title,
  description,
  total,
}) => (
  <Wrapper data-testid="graph-description">
    <DescriptionWrapper>
      <div>
        <Title as="h3" data-testid="graph-title" >{title}</Title>
        <Paragraph data-testid="graph-description">{description}</Paragraph>
      </div>
      <Total data-testid="total-open">{total.toLocaleString()}</Total>
    </DescriptionWrapper>
    <Triangle />
  </Wrapper>
)

export default GraphDescription
