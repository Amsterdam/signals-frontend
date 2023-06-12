import { Column } from '@amsterdam/asc-ui'

import { StyledColumn, StyledRow } from './styled'
import { StatusCode } from '../../../../definitions/types'
import { Summary } from '../Summary'
import type { StandardText } from '../Summary/Summary'

const DummyTexts: StandardText[] = [
  {
    id: 1,
    title: 'Test title 1',
    text: 'Bedankt voor je mederwerking, dit gaan we doen!',
    active: true,
    state: StatusCode.Afgehandeld,
    categories: [4, 176],
    updated_at: '2023-04-18T12:59:38.586196+02:00',
    created_at: '2023-04-18T12:58:56.852662+02:00',
  },
  {
    id: 2,
    title: 'Test title 2',
    text: 'Jammer dat je het niet met ons eens bent',
    active: true,
    state: StatusCode.Afgehandeld,
    categories: [4, 176],
    updated_at: '2023-04-18T12:59:38.586196+02:00',
    created_at: '2023-04-18T12:58:56.852662+02:00',
  },
]

export const OverviewPage = () => {
  return (
    <StyledRow>
      <Column span={12}>
        <h1>Standaard teksten overzicht</h1>
      </Column>

      <Column span={4}>
        <div>[FILTER]</div>
      </Column>
      <StyledColumn span={6}>
        <div>[SEARCH BAR]</div>
        {DummyTexts.map((text) => {
          return <Summary standardText={text} key={text.id} />
        })}
      </StyledColumn>
    </StyledRow>
  )
}
