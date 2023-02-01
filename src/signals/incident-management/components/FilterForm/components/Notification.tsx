// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { MutableRefObject } from 'react'
import { useEffect } from 'react'

import { Alert } from '@amsterdam/asc-ui'

import { StyledNotification } from '../styled'

export type Props = {
  reference: MutableRefObject<HTMLDivElement | null>
}

export const Notification = ({ reference }: Props) => {
  useEffect(() => {
    if (reference.current) {
      reference.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [reference])

  return (
    <StyledNotification ref={reference}>
      <Alert level="error" outline tabIndex={-1}>
        Helaas is de combinatie van deze filters te groot. Maak een kleinere
        selectie.
      </Alert>
    </StyledNotification>
  )
}
