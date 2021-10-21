// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { forwardRef, useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  themeColor,
  themeSpacing,
  TextArea as AscTextArea,
} from '@amsterdam/asc-ui'

import type { ChangeEvent, ReactNode } from 'react'
import type { TextAreaProps as AscTextAreaProps } from '@amsterdam/asc-ui/es/components/TextArea'

import Label from 'components/Label'
import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'

const lineHeight = 22
const infoFontSize = 14

const StyledErrorMessage = styled(ErrorMessage)`
  margin-bottom: ${themeSpacing(2)};
`

const StyledArea = styled(AscTextArea)<{ rows?: number; maxRows?: number }>`
  margin-top: ${themeSpacing(1)};
  font-family: inherit;
  vertical-align: top; /* https://stackoverflow.com/questions/7144843/extra-space-under-textarea-differs-along-browsers */
  min-height: ${({ rows = 5 }) => rows * lineHeight}px;
  resize: vertical;
  max-height: ${({ maxRows = 15 }) => maxRows * lineHeight}px;
  line-height: ${lineHeight}px;
`

const InfoText = styled.div`
  color: ${themeColor('tint', 'level5')};
  margin-top: ${themeSpacing(2)};
  font-size: ${infoFontSize}px;
`

interface TextAreaProps extends AscTextAreaProps {
  errorMessage?: string
  id?: string
  infoText?: ReactNode
  label?: ReactNode
  maxContentLength?: number
  maxRows?: number
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  value?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      errorMessage,
      id,
      infoText,
      label,
      maxContentLength,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [contents, setContents] = useState('')

    const onChangeContent = useCallback(
      (event) => {
        const value = event.target.value

        setContents(value)

        if (onChange !== undefined) {
          onChange(event)
        }
      },
      [setContents, onChange]
    )

    return (
      <ErrorWrapper invalid={Boolean(errorMessage)}>
        {label && (
          <Label inline htmlFor={id}>
            {label}
          </Label>
        )}

        {errorMessage && <StyledErrorMessage message={errorMessage} />}

        <StyledArea
          id={id}
          className={className}
          {...props}
          onChange={onChangeContent}
          value={value || contents}
          ref={ref}
        />

        {maxContentLength && maxContentLength > 0 ? (
          <InfoText>{`${contents.length} / ${maxContentLength} tekens`}</InfoText>
        ) : (
          infoText && <InfoText>{infoText}</InfoText>
        )}
      </ErrorWrapper>
    )
  }
)

export default TextArea
