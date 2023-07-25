import type { ReactNode } from 'react'

import { StyledSection } from './styled'

export type Props = {
  children?: ReactNode
}

export const ModalContent = ({ children }: Props) => {
  const childItem = children ? children : 'Er is geen back-up beschikbaar.'
  return <StyledSection data-testid="modal-content">{childItem}</StyledSection>
}
