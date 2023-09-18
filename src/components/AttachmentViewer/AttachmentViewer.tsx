// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  ChevronLeft,
  ChevronRight,
  Close as CloseIcon,
} from '@amsterdam/asc-assets'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import { getAttachmentFileName } from 'shared/services/get-attachment-file-name'

import {
  CloseButton,
  Date,
  Header,
  Info,
  ModalInner,
  NextButton,
  PreviousButton,
  Reporter,
  StyledInteractiveImage,
  StyledModal,
  Title,
  Wrapper,
} from './styles'
// TODO: add caption?
export interface FormattedAttachment {
  location: string
  createdAt: string | null
  createdBy: string | null
}

interface Props {
  href: string
  attachments: FormattedAttachment[]
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
  const fileName = getAttachmentFileName(currentAttachment.location)

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
          <Reporter>{currentAttachment.stateShown}</Reporter>
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
          data-testid="close-btn"
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
          <StyledInteractiveImage
            src={currentHref}
            data-testid="attachment-viewer-image"
            alt={fileName}
            caption={currentAttachment.caption}
          />
        </Wrapper>
      </ModalInner>
    </StyledModal>
  )
}

export default AttachmentViewer
