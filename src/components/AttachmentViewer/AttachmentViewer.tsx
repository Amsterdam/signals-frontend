// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import type { FC } from 'react'
import { useCallback, useEffect, useState, useRef } from 'react'

import { Close as CloseIcon } from '@amsterdam/asc-assets'
import { ChevronRight, ChevronLeft } from '@amsterdam/asc-assets'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import {
  CloseButton,
  Date,
  Employee,
  Header,
  Img,
  Info,
  ModalInner,
  NextButton,
  PreviousButton,
  Reporter,
  StyledModal,
  Title,
  Wrapper,
} from './styles'

export interface Attachment {
  location: string
  createdAt?: string
  createdBy?: string
}

interface Props {
  href: string
  attachments: Attachment[]
  onClose: () => void
}

const AttachmentViewer: FC<Props> = ({ href, attachments, onClose }) => {
  const wrapperRef = useRef(null)
  const nextButtonRef = useRef(null)
  const previousButtonRef = useRef(null)
  const [currentHref, setCurrentHref] = useState(href)
  const index = attachments.findIndex((item) => item.location === currentHref)
  const previous = index > 0 ? attachments[index - 1].location : false
  const next =
    index < attachments.length - 1 ? attachments[index + 1].location : false
  const currentAttachment = attachments[index]
  const fileName = currentAttachment.location?.split('/').pop() || ''

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (previous) {
            setCurrentHref(previous)
          }

          break

        case 'ArrowRight':
          if (next) {
            setCurrentHref(next)
          }

          break

        default:
          break
      }
    },
    [next, previous]
  )

  /**
   * Register and unregister listeners
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const onClickModal = useCallback(
    (event) => {
      if (event.target.contains(wrapperRef.current)) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (nextButtonRef.current) (nextButtonRef.current as HTMLElement).focus()
    else if (previousButtonRef.current)
      (previousButtonRef.current as HTMLElement).focus()
  }, [])

  return (
    <StyledModal
      data-testid="modal"
      open
      onClose={onClose}
      onClick={onClickModal}
    >
      <Header>
        <Info>
          {currentAttachment.createdBy ? (
            <Employee>{currentAttachment.createdBy}</Employee>
          ) : (
            <Reporter>Melder</Reporter>
          )}
          {currentAttachment.createdAt && (
            <Date>
              {format(
                parseISO(currentAttachment.createdAt),
                'dd-MM-yyyy HH:mm'
              )}
            </Date>
          )}
        </Info>
        <Title>{fileName}</Title>

        <CloseButton
          data-testid="closeBtn"
          square
          onClick={onClose}
          size={64}
          iconSize={20}
          variant="blank"
          title="Sluiten"
          icon={<CloseIcon />}
        />
      </Header>

      <ModalInner data-scroll-lock-scrollable>
        <Wrapper ref={wrapperRef} data-testid="attachment-viewer-modal-wrapper">
          {previous && (
            <PreviousButton
              data-testid="attachment-viewer-button-previous"
              square
              ref={previousButtonRef}
              size={64}
              iconSize={20}
              variant="blank"
              icon={<ChevronLeft />}
              onClick={() => setCurrentHref(previous)}
            />
          )}

          {next && (
            <NextButton
              data-testid="attachment-viewer-button-next"
              square
              ref={nextButtonRef}
              size={64}
              iconSize={20}
              variant="blank"
              icon={<ChevronRight />}
              onClick={() => setCurrentHref(next)}
            />
          )}

          <Img
            src={currentHref}
            data-testid="attachment-viewer-image"
            alt={fileName}
          />
        </Wrapper>
      </ModalInner>
    </StyledModal>
  )
}

export default AttachmentViewer
