import { Icon, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import Paragraph from 'components/Paragraph'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Checkmark } from '@amsterdam/asc-assets'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

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
        <Icon size={32} color="white">
          <Checkmark />
        </Icon>
      </IconWrapper>
      <Paragraph>
        <strong>{text}</strong>
      </Paragraph>
    </Wrapper>
  )
}

export default GraphEmpty
