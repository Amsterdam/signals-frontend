// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Column, Heading, Row, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { Signaling } from '../Dashboard/components'

const StyledH1 = styled(Heading)`
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`
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
