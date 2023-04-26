// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Column, Row } from '@amsterdam/asc-ui'

import { StyledH1 } from './styled'
import { Signaling } from '../Dashboard/components'

export const SignalingContainer = () => {
  return (
    <Row>
      <Column span={12}>
        <StyledH1>Signalering</StyledH1>
      </Column>
      <Signaling />
    </Row>
  )
}
