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
  id: number
  title: string
  text: string
  active: boolean
  state: StatusCode
  categories: [4, 176]
  updated_at: '2023-04-18T12:59:38.586196+02:00'
  created_at: '2023-04-18T12:58:56.852662+02:00'
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
