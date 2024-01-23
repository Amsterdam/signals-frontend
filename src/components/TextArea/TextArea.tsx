// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { forwardRef, useState, useCallback, useEffect } from 'react'
import type { ChangeEvent, ReactNode, ForwardedRef } from 'react'

import type { TextAreaProps as AscTextAreaProps } from '@amsterdam/asc-ui/es/components/TextArea'

import Label from 'components/Label'

import {
  StyledErrorMessage,
  StyledArea,
  InfoText,
  ErrorWrapper,
} from './styled'

interface TextAreaProps extends AscTextAreaProps {
  defaultValue?: string
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
      defaultValue,
      errorMessage,
      id,
      infoText,
      label,
      maxContentLength,
      onChange,
      value,
      ...props
    },
    ref?: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const [contents, setContents] = useState('')

    // prefer defaultValue over value if both are present
    const contentProps: { defaultValue?: string; value?: string } = {
      [defaultValue ? 'defaultValue' : 'value']: contents,
    }

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

    const textareaInfoText =
      maxContentLength && maxContentLength > 0
        ? `${contents.length}/${maxContentLength} tekens`
        : infoText

    useEffect(() => {
      setContents(defaultValue || value || '')
    }, [defaultValue, value])

    return (
      <ErrorWrapper invalid={Boolean(errorMessage)}>
        {label && <Label htmlFor={id}>{label}</Label>}

        <div role="status">
          {errorMessage && (
            <StyledErrorMessage
              id="textareaErrorMessage"
              message={errorMessage}
            />
          )}
        </div>

        <StyledArea
          aria-describedby="textareaInfoText textareaErrorMessage"
          className={className}
          id={id}
          onChange={onChangeContent}
          ref={ref}
          {...props}
          {...contentProps}
        />

        {textareaInfoText && (
          <InfoText id="textareaInfoText">{textareaInfoText}</InfoText>
        )}
      </ErrorWrapper>
    )
  }
)

TextArea.defaultProps = {
  className: undefined,
}

export default TextArea
