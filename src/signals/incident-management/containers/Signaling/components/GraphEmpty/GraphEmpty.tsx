import { Icon, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import Paragraph from 'components/Paragraph'
import type { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Checkmark } from '@amsterdam/asc-assets'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledIcon = styled(Icon).attrs(() => ({
  color: 'white',
  size: 32,
}))``

const IconWrapper = styled.div`
  height: ${themeSpacing(14)};
  width: ${themeSpacing(14)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: ${themeSpacing(8)};
  margin-bottom: ${themeSpacing(4)};

  background-color: ${themeColor('supplement', 'darkgreen')};
  border-radius: 50%;
`

interface GraphEmptyProps {
  text: string
}

const GraphEmpty: FunctionComponent<GraphEmptyProps> = ({ text }) => {
  return (
    <Wrapper>
      <IconWrapper>
        <StyledIcon>
          <Checkmark data-testid="checkmark" />
        </StyledIcon>
      </IconWrapper>
      <Paragraph data-testid="empty-text">
        <strong>{text}</strong>
      </Paragraph>
    </Wrapper>
  )
}

export default GraphEmpty
