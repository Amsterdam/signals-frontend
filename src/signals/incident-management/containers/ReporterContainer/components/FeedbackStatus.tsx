// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { themeColor } from '@amsterdam/asc-ui'
import { useMemo } from 'react'
import type { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Theme } from 'types/theme'
import type { Feedback } from '../types'

interface FeedbackStatusProps {
  feedback: Feedback | null
  className?: string
}

const Status = styled.span<{ feedback: Feedback | null; theme: Theme }>`
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
    <Status className={className} feedback={feedback}>
      {text}
    </Status>
  )
}

export default FeedbackStatus
