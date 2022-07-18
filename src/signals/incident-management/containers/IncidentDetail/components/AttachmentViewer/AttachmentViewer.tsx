// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import type { FC } from 'react'
import { useCallback, useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Button, Modal, themeSpacing } from '@amsterdam/asc-ui'
import { Close as CloseIcon } from '@amsterdam/asc-assets'
import { ChevronRight, ChevronLeft } from '@amsterdam/asc-assets'
import type { Attachment } from '../../types'

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
  background-color: rgb(0, 0, 0, 0.7);
`

const ModalInner = styled.div`
  height: 100vh;
  overflow: hidden auto;
  text-align: center;

  ${({ theme }) => css`
    ${theme.breakpoints.laptopM('max-width')} {
      max-width: 1200px;
    }

    ${theme.breakpoints.laptop('max-width')} {
      max-width: 1024px;
    }

    ${theme.breakpoints.tabletM('max-width')} {
      max-width: 768px;
    }
  `}
`

const Header = styled.header`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  height: 64px;
  background-color: rgb(0, 0, 0, 0.7);
  color: #fff;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
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
`

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

const PreviousButton = styled(StyledButton)`
  position: absolute;
  left: 0;
  top: calc(50% - ${themeSpacing(4)});
`

const NextButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  top: calc(50% - ${themeSpacing(4)});
`

const Img = styled.img`
  margin: 92px auto 20px;
  max-width: 100%;
`

interface Props {
  href: string
  attachments: Attachment[]
  onClose: () => void
}

const AttachmentViewer: FC<Props> = ({ href, attachments, onClose }) => {
  const wrapperRef = useRef(null)
  const [currentHref, setCurrentHref] = useState(href)
  const index = attachments.findIndex((item) => item.location === currentHref)
  const previous = index > 0 ? attachments[index - 1].location : false
  const next =
    index < attachments.length - 1 ? attachments[index + 1].location : false

  const handleKeyDown = useCallback(
    (event) => {
      const refInTarget = event.target.contains(wrapperRef.current)

      if (!refInTarget) {
        return
      }

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

  return (
    <StyledModal
      data-testid="modal"
      open
      onClose={onClose}
      backdropOpacity={1}
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

        <StyledButton
          data-testid="closeBtn"
          square
          onClick={onClose}
          size={64}
          iconSize={20}
          variant="blank"
          icon={<CloseIcon />}
        />
      </Header>

      <ModalInner data-scroll-lock-scrollable>
        <div ref={wrapperRef}>
          {previous && (
            <PreviousButton
              data-testid="attachment-viewer-button-previous"
              square
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
        </div>
      </ModalInner>
    </StyledModal>
  )
}

export default AttachmentViewer
