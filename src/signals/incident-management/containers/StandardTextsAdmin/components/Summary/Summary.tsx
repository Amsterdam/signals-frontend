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
import type {
  StatusCode,
  Status as StatusType,
} from '../../../../definitions/types'

export type StandardText = {
  active: boolean
  id: number
  meta: Record<any, any>
  state: StatusCode
  text: string
  title: string
}

interface Props {
  standardText: StandardText
}

export const Summary = ({ standardText }: Props) => {
  const { state, title, text } = standardText

  const status = statusList.find(({ key }) => key === state) as StatusType

  return (
    <Wrapper>
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
