import { useCallback, useEffect, useState } from 'react'

import { ChevronDown } from '@amsterdam/asc-assets'

import type { Props as StyleProps } from './styled'
import {
  AccordionButton,
  AccordionButtonContent,
  AccordionContent,
} from './styled'

type Props = {
  id: string
  title: string
  count: number | string
  onToggle?: (open: boolean) => void
  children: React.ReactNode
} & StyleProps

export const Accordion = ({
  children,
  count,
  title,
  isOpen,
  id,
  onToggle,
}: Props) => {
  const [open, setOpen] = useState(isOpen ?? false)

  useEffect(() => {
    if (isOpen !== undefined && isOpen !== open) {
      setOpen(isOpen)
    }
  }, [isOpen, open])

  const handleClick = useCallback(() => {
    const newOpenState = !open
    if (onToggle) {
      onToggle(newOpenState)
    }
    setOpen(newOpenState)
  }, [open, onToggle])

  return (
    <>
      <AccordionButton
        aria-controls={id}
        aria-expanded={open}
        type="button"
        variant="tertiary"
        iconRight={<ChevronDown />}
        isOpen={open}
        title={title}
        onClick={handleClick}
      >
        <AccordionButtonContent>
          {title}
          {count ? ` (${count})` : ''}
        </AccordionButtonContent>
      </AccordionButton>
      <AccordionContent isOpen={open} aria-labelledby={`label-${id}`} id={id}>
        {children}
      </AccordionContent>
    </>
  )
}
