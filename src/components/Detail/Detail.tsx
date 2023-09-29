import { useState } from 'react'

import {
  Content,
  Container,
  StyledChevronDown as ChevronDown,
  InvisibleButton,
  Paragraph,
  Header,
  Wrapper,
} from './styled'

interface Props {
  header: string
  content: string
  children?: React.ReactNode
}

export const Detail = ({ header, content, children }: Props) => {
  const [showInfo, setShowInfo] = useState(false)

  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()

    setShowInfo(!showInfo)
  }

  return (
    <Container>
      <Wrapper onClick={handleOnClick}>
        <Header>{header}</Header>

        <InvisibleButton
          title={`${showInfo ? 'Verberg' : 'Toon'} informatie`}
          aria-expanded={showInfo}
          aria-controls="detailed-information"
          toggle={showInfo}
        >
          <ChevronDown width={14} height={14} />
        </InvisibleButton>
      </Wrapper>

      <Content id="detailed-information" visible={showInfo}>
        <Paragraph>{content}</Paragraph>
        {children}
      </Content>
    </Container>
  )
}
