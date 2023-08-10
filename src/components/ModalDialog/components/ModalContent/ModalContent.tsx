// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { Wrapper } from './styled'

export type Props = {
  children?: ReactNode
}

export const ModalContent = ({ children }: Props) => {
  return (
    <Wrapper>
      <div data-testid="modal-content">{children}</div>
    </Wrapper>
  )
}
