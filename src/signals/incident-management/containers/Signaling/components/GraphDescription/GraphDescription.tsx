// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Paragraph from 'components/Paragraph'

const GRAPH_DESCRIPTION_COLOR = themeColor('tint', 'level3')

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: ${themeSpacing(1)};
`

const Title = styled(Heading)`
  font-size: 1.25rem;
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
  <Wrapper>
    <DescriptionWrapper>
      <div>
        <Title as="h3" data-testid="graph-title">
          {title}
        </Title>
        <Paragraph data-testid="graph-description">{description}</Paragraph>
      </div>
      <Total data-testid="total-open">{total.toLocaleString('nl-NL')}</Total>
    </DescriptionWrapper>
    <Triangle />
  </Wrapper>
)

export default GraphDescription
