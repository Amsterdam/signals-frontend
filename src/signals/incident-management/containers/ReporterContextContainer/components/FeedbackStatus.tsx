// Copyright (C) 2021 Gemeente Amsterdam
import { themeColor } from '@amsterdam/asc-ui'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Theme } from 'types/theme'
import { Feedback } from '../types'

interface FeedbackStatusProps {
  feedback: Feedback
  className?: string
}

const Status = styled.span<{ feedback: Feedback; theme: Theme }>`
  ${({ feedback, theme }) => {
    if (feedback === null || !feedback.submitted_at) return

    return `color: ${themeColor(
      'support',
      feedback.is_satisfied ? 'valid' : 'invalid'
    )({ theme })}`
  }}
`

const FeedbackStatus: React.FunctionComponent<FeedbackStatusProps> = ({
  feedback,
  className,
}) => {
  const text = useMemo(() => {
    if (!feedback) return '-'
    if (!feedback.submitted_at) return 'Niet ontvangen'

    return feedback.is_satisfied ? 'Tevreden' : 'Niet tevreden'
  }, [feedback])

  return (
    <Status className={className} feedback={feedback}>
      {text}
    </Status>
  )
}

export default FeedbackStatus
