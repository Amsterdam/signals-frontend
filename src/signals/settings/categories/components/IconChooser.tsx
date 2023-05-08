// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam

import type { RefObject } from 'react'
import { useCallback, useState } from 'react'

import { TrashBin } from '@amsterdam/asc-assets'

import {
  DeleteButton,
  IconUploadWrapper,
  StyledAlert,
  StyledButton,
  StyledImg,
  StyledParagraph,
  StyledParagraphStrong,
  WrapperInputIcon,
  WrapperSetIcon,
} from './styled'
import ErrorMessage from '../../../../components/ErrorMessage'

const MAX = 32 // 32 px is max height and width of icon
export interface Props {
  name: string
  value: File | string
  onChange: (...event: any[]) => void
  iconButtonText: string
  updateErrorUploadIcon: (arg: boolean) => void
  inputRef: RefObject<HTMLInputElement>
}

export const IconChooser = ({
  name,
  value = '',
  onChange,
  iconButtonText,
  updateErrorUploadIcon,
  inputRef,
}: Props) => {
  const [error, setError] = useState('')
  const [$hasError, set$hasError] = useState(false)

  /* istanbul ignore next */
  const onKeyDownHandler = useCallback(
    (event) => {
      if (['Enter', 'Space'].includes(event.code)) {
        inputRef.current?.click()
      }
    },
    [inputRef]
  )

  return (
    <IconUploadWrapper>
      {value && (
        <>
          <StyledImg
            alt={'icon added'}
            src={
              value instanceof File ? window.URL.createObjectURL(value) : value
            }
          />
          <StyledAlert>
            {iconButtonText === 'Icoon wijzigen' && (
              <>
                <StyledParagraphStrong>
                  Let op! Er wordt geen back-up van het icoon gemaakt.
                </StyledParagraphStrong>
                <StyledParagraph>
                  Om te annuleren gebruik de knop onderaan de pagina.
                </StyledParagraph>
              </>
            )}
          </StyledAlert>
        </>
      )}
      {error && <ErrorMessage message={error} />}
      <WrapperSetIcon>
        <WrapperInputIcon
          onKeyDown={onKeyDownHandler}
          data-testid="icon-input-upload-button"
        >
          <input
            ref={inputRef}
            type="file"
            id="iconUpload"
            accept=".svg"
            multiple={false}
            name={name}
            onChange={(event) => {
              if (event.target.files && event.target.files[0]) {
                setError('')
                set$hasError(false)
                onChange(undefined)
                const file = event.target.files[0]
                const parser = new DOMParser()

                file.text().then((icon) => {
                  const svgDoc = parser.parseFromString(icon, 'image/svg+xml')
                  const heightExists = svgDoc
                    .querySelector('svg')
                    ?.getAttribute('height')
                  const widthExists = svgDoc
                    .querySelector('svg')
                    ?.getAttribute('width')

                  if (!heightExists) {
                    updateErrorUploadIcon(true)
                    setError(
                      'Dit icoon heeft geen height. Gebruik alleen iconen met een height.'
                    )
                    return
                  }

                  if (!widthExists) {
                    updateErrorUploadIcon(true)
                    setError(
                      'Dit icoon heeft geen width. Gebruik alleen iconen met een width.'
                    )
                    return
                  }
                  const height = parseInt(heightExists)
                  const width = parseInt(widthExists)

                  if (height > MAX || width > MAX) {
                    updateErrorUploadIcon(true)
                    updateErrorUploadIcon(true)
                    set$hasError(true)
                    setError(
                      `De afmetingen van het bestand zijn te groot. De height is ${height} en de width is ${width}. Maximaal 32px bij 32px.`
                    )
                    return
                  }

                  onChange(file)
                })
              }
            }}
          />
          <label htmlFor="iconUpload">
            <StyledButton
              name="Icon"
              variant="application"
              type="button"
              forwardedAs={'span'}
              tabIndex={0}
              $hasError={$hasError}
            >
              {iconButtonText}
            </StyledButton>
          </label>
        </WrapperInputIcon>

        {value && (
          <DeleteButton
            variant="blank"
            icon={<TrashBin />}
            data-testid="delete-icon-button"
            aria-label={`Verwijder icoon`}
            type="button"
            onClick={() => {
              setError('')
              return onChange(undefined)
            }}
          />
        )}
      </WrapperSetIcon>
    </IconUploadWrapper>
  )
}
