import type { ReactNode } from 'react'

import { StyledSection } from './styled'

export type Props = {
  children?: ReactNode
}

export const ModalContent = ({ children }: Props) => {
  return <StyledSection data-testid="modal-content">{children}</StyledSection>
}
