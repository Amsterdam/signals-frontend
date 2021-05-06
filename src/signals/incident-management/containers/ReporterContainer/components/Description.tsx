import { FunctionComponent } from 'react'
import { Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { Feedback } from '../types'
import FeedbackStatus from './FeedbackStatus'

export const RECEIVE_FEEDBACK = 'RECEIVE_FEEDBACK'

const DescriptionStyle = styled(Paragraph)`
  font-size: 16px;
  line-height: ${themeSpacing(6)};
`

const Description: FunctionComponent<{
  what?: string
  description: string
}> = ({ what, description }) => {
  if (what === RECEIVE_FEEDBACK) {
    const descriptionList = description.split('\n')
    const feedback: Feedback = {
      submittedAt: '-',
      isSatisfied: descriptionList[0].startsWith('Ja'),
    }
    return (
      <>
        <FeedbackStatus feedback={feedback} />
        <DescriptionStyle>
          {descriptionList.slice(1).join('\n')}
        </DescriptionStyle>
      </>
    )
  }

  return <DescriptionStyle>{description}</DescriptionStyle>
}

export default Description
