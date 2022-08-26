// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC, MutableRefObject } from 'react'
import { useEffect } from 'react'

import { Alert } from '@amsterdam/asc-ui'
import { StyledNotification } from '../styled'

export type Props = {
  reference: MutableRefObject<HTMLDivElement | null>
}

export const Notification: FC<Props> = ({ reference }) => {
  useEffect(() => {
    if (reference.current) {
      reference.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [reference])

  return (
    <StyledNotification ref={reference}>
      <Alert level="error" outline={true} tabIndex={-1}>
        Helaas is de combinatie van deze filters te groot. Maak een kleinere
        selectie.
      </Alert>
    </StyledNotification>
  )
}
