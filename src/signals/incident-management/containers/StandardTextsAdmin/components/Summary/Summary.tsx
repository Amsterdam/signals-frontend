import { ChevronRight } from '@amsterdam/asc-assets'

import type { StandardText } from 'types/api/standard-texts'
import onButtonPress from 'utils/on-button-press'

import { StyledIcon } from './styled'
import {
  ColumnDescription,
  ColumnStatus,
  Status,
  Text,
  Title,
  Wrapper,
} from './styled'
import statusList from '../../../../definitions/statusList'
import type { Status as StatusType } from '../../../../definitions/types'

export interface Props {
  standardText: StandardText
  onClick: (id: number) => void
}

const renderHighlight = (value: string) =>
  value.split(/(<em>[\s\S]*?<\/em>)/gi).map((part, index) => {
    const match = /^<em>([\s\S]*?)<\/em>$/i.exec(part)

    return match ? <em key={index}>{match[1]}</em> : part
  })

export const Summary = ({ standardText, onClick }: Props) => {
  const {
    state,
    title: originalTitle,
    text,
    id,
    meta: { highlight },
  } = standardText

  const status = statusList.find(({ key }) => key === state) as StatusType

  const highlightedTitle = highlight?.title?.join('...')
  const highlightedDescription = highlight?.text?.join('...')

  return (
    <Wrapper
      // istanbul ignore next
      onKeyDown={(e) => {
        onButtonPress(e, () => onClick(id))
      }}
      onClick={() => onClick(id)}
      tabIndex={0}
      role={'button'}
      data-testid="summary-standard-text"
    >
      <ColumnStatus>
        <StyledIcon size={12}>
          <ChevronRight />
        </StyledIcon>
        <Status>{status.value}</Status>
      </ColumnStatus>

      <ColumnDescription>
        <Title>
          {highlightedTitle ? renderHighlight(highlightedTitle) : originalTitle}
        </Title>
        <Text $isHighlighted={Boolean(highlight?.text)}>
          {highlightedDescription
            ? renderHighlight(highlightedDescription)
            : text}
        </Text>
      </ColumnDescription>
    </Wrapper>
  )
}
