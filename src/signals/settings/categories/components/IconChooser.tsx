// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam

import type { RefObject } from 'react'
import { useCallback } from 'react'

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

export interface Props {
  name: string
  value: File | string
  onChange: (...event: any[]) => void
  iconButtonText: string
  inputRef: RefObject<HTMLInputElement>
}

export const IconChooser = ({
  name,
  value = '',
  onChange,
  iconButtonText,
  inputRef,
}: Props) => {
  // const [error, setError] = useState('')
  // const [$hasError, set$hasError] = useState(false)

  // const { formState } = useFormContext()

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
      {/*todo load this when there's an error state, a bit like incidentform */}
      {/*{error && <ErrorMessage message={error} />}*/}
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
                const file = event.target.files[0]
                onChange(file)
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
              $hasError={false} // $hasErrors value is based on error state from react hook form
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
              return onChange(undefined)
            }}
          />
        )}
      </WrapperSetIcon>
    </IconUploadWrapper>
  )
}
