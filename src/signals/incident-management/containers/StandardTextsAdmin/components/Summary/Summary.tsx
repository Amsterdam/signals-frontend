import { ChevronRight } from '@amsterdam/asc-assets'

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
import type { StandardText } from '../../types'

export interface Props {
  standardText: StandardText
  onClick: (id: number) => void
}

export const Summary = ({ standardText, onClick }: Props) => {
  const { state, title, text, id } = standardText

  const status = statusList.find(({ key }) => key === state) as StatusType

  return (
    <Wrapper onClick={() => onClick(id)} data-testid="summary-standard-text">
      <ColumnStatus>
        <StyledIcon size={12}>
          <ChevronRight />
        </StyledIcon>
        <Status>{status.value}</Status>
      </ColumnStatus>

      <ColumnDescription>
        <Title>{title}</Title>
        <Text>{text}</Text>
      </ColumnDescription>
    </Wrapper>
  )
}
