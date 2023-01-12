// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useMemo } from 'react'
import type { FunctionComponent } from 'react'

import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import type { Theme } from 'types/theme'

import type { Feedback } from '../types'

interface FeedbackStatusProps {
  feedback: Feedback | null
  className?: string
}

const Status = styled.div<{ feedback: Feedback | null; theme: Theme }>`
  font-weight: bold;
  margin-bottom: ${themeSpacing(1)};
  ${({ feedback, theme }) => {
    if (feedback === null || !feedback.submittedAt) return

    return `color: ${themeColor(
      'support',
      feedback.isSatisfied ? 'valid' : 'invalid'
    )({ theme })}`
  }}
`

const FeedbackStatus: FunctionComponent<FeedbackStatusProps> = ({
  feedback,
  className,
}) => {
  const text = useMemo(() => {
    if (!feedback) return '-'
    if (!feedback.submittedAt) return 'Niet ontvangen'

    return feedback.isSatisfied ? 'Tevreden' : 'Niet tevreden'
  }, [feedback])

  return (
    <Status
      data-testid="feedback-status"
      className={className}
      feedback={feedback}
    >
      {text}
    </Status>
  )
}

export default FeedbackStatus
