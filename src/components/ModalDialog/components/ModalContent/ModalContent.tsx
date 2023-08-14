// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { Content, Wrapper } from './styled'

export type Props = {
  children?: ReactNode
  $hasIframe: boolean
}

export const ModalContent = ({ children, $hasIframe }: Props) => (
  <Wrapper $hasIframe={$hasIframe}>
    <Content data-testid="modal-content">{children}</Content>
  </Wrapper>
)
