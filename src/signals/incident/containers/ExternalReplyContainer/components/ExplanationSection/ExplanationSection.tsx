// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Paragraph from 'components/Paragraph'

type File = {
  description: string
  file: string
}

type ExplanationSectionProps = {
  title: string
  text: string | null
  files?: File[]
  onSelectFile?: (file: File) => void
  className?: string
}

const ImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeSpacing(2)};
  margin-top: ${themeSpacing(2)};
`

const Image = styled.img`
  width: 100px;
  object-fit: cover;
  :hover {
    cursor: pointer;
    filter: brightness(90%);
  }
`

const StyledHeading = styled(Heading)`
  margin-bottom: 0;
`

const Section = styled.section`
  margin-bottom: ${themeSpacing(6)};
`

const ExplanationSection = ({
  title,
  text,
  files = [],
  onSelectFile,
  className,
}: ExplanationSectionProps) => {
  const handleImageKeyPress: (
    file: File
  ) => React.KeyboardEventHandler<HTMLElement> = (file) => (event) => {
    if (event.key === 'Enter' && onSelectFile) {
      onSelectFile(file)
    }
  }
  return (
    <Section className={className}>
      <StyledHeading forwardedAs="h4">{title}</StyledHeading>

      {text &&
        text.split('\n').map((line) => (
          <Paragraph key={line} gutterBottom={0}>
            {line}
          </Paragraph>
        ))}

      {files.length > 0 ? (
        <ImageWrapper>
          {files.map((file) => (
            <Image
              tabIndex={0}
              onKeyDown={handleImageKeyPress(file)}
              onClick={() => {
                if (onSelectFile) {
                  onSelectFile(file)
                }
              }}
              key={file.description}
              src={file.file}
              alt={file.description}
            />
          ))}
        </ImageWrapper>
      ) : null}
    </Section>
  )
}

export default ExplanationSection
