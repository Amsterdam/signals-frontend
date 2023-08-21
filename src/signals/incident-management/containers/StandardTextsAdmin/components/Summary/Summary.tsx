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

export const Summary = ({ standardText, onClick }: Props) => {
  const {
    state,
    title: originalTitle,
    text,
    id,
    meta: { highlight },
  } = standardText

  const status = statusList.find(({ key }) => key === state) as StatusType

  const title = highlight?.title ? highlight.title : originalTitle
  const description = highlight?.text ? highlight.text.join('...') : text

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
        <Title dangerouslySetInnerHTML={{ __html: title }} />
        <Text
          dangerouslySetInnerHTML={{ __html: description }}
          $isHighlighted={highlight?.text}
        />
      </ColumnDescription>
    </Wrapper>
  )
}
