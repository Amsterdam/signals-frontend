// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import type { FC } from 'react'
import { useCallback, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

import { Button, Modal } from '@amsterdam/asc-ui'
import { Close as CloseIcon } from '@amsterdam/asc-assets'
import { ChevronRight, ChevronLeft } from '@amsterdam/asc-assets'
import type { Attachment } from '../../types'

const StyledButton = styled(Button)`
  background-color: #000;
  min-width: 64px;

  & svg {
    // Make the close icon white (https://codepen.io/sosuke/pen/Pjoqqp)
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(164deg)
      brightness(103%) contrast(103%);
  }

  &:hover {
    background-color: rgb(0, 0, 0, 0.7);

    & svg {
      // Make the close icon white (https://codepen.io/sosuke/pen/Pjoqqp)
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(164deg)
        brightness(103%) contrast(103%);
    }
  }
`

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const StyledModal = styled(Modal)`
  max-height: 100vh;
  height: 100vh;
  max-width: 100vw;
  width: 100vw;
  background-color: transparent;
`

const ModalInner = styled.div`
  height: 100vh;
  overflow: hidden;
  text-align: center;
`

const Header = styled.header`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: 16px;
  height: 64px;
  background-color: rgb(0, 0, 0, 0.7);
  color: #fff;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  white-space: nowrap;
`

const Reporter = styled.div`
  width: fit-content;
  margin-top: 12px;
  padding 0 8px;
  background-color: white;
  color: black;
  font-size: 12px;
  line-height: 20px;
  text-transform: uppercase;
  font-weight: bold;
`

const Employee = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
`

const Date = styled.div`
  margin-bottom: 8px;
  font-size: 16px;
  line-height: 24px;
`

const Title = styled.div`
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
`
const CloseButton = styled(StyledButton)`
  justify-self: end;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PreviousButton = styled(StyledButton)`
  position: absolute;
  left: 0;
  top: 50%;
`

const NextButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  top: 50%;
`

const Img = styled.img`
  margin: 92px 0 20px;
  max-width: 100%;
  max-height: calc(100% - 112px);
`

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

  const fileName = attachments[index].location?.split('/').pop() || ''

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
          {attachments[index].created_by ? (
            <Employee>{attachments[index].created_by}</Employee>
          ) : (
            <Reporter>Melder</Reporter>
          )}
          <Date>
            {format(
              parseISO(attachments[index].created_at),
              'dd-MM-yyyy HH:mm'
            )}
          </Date>
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
