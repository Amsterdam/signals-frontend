/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2023 Gemeente Amsterdam */
import { useCallback, useState } from 'react'

import { ChevronDown } from '@amsterdam/asc-assets'

import { Button, ButtonContent, Content, Wrapper, Border } from './styled'

type Props = {
  id: string
  title: string
  count: number | string
  onToggle?: (open: boolean) => void
  children: React.ReactNode
}

export const Accordion = ({ children, count, title, id, onToggle }: Props) => {
  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => {
    if (onToggle) {
      onToggle(!open)
    }
    setOpen(!open)
  }, [open, onToggle])

  return (
    <Wrapper isOpen={open}>
      <Border isOpen={open}>
        <Button
          aria-controls={id}
          aria-expanded={open}
          type="button"
          variant="textButton"
          isOpen={open}
          onClick={handleClick}
        >
          <ButtonContent>
            {title}
            {count ? ` (${count})` : ''}
            <ChevronDown width={20} height={20} />
          </ButtonContent>
        </Button>
        <Content isOpen={open} aria-labelledby={`label-${id}`} id={id}>
          {children}
        </Content>
      </Border>
    </Wrapper>
  )
}
