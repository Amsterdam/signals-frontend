// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { forwardRef, useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, ReactNode, SyntheticEvent, FocusEvent } from 'react'

import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'
import TextArea from 'components/TextArea'

export interface AddNoteProps {
  className?: string
  error?: string
  isStandalone?: boolean
  label?: ReactNode
  maxContentLength?: number
  name?: string
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit?: (
    event: SyntheticEvent<HTMLInputElement>,
    value?: string | null
  ) => boolean
  onCancel?: () => void
  rows?: number
  value?: string
  withToggle?: boolean
}

const NoteButton = styled(Button)`
  margin: ${themeSpacing(8, 2, 4, 0)};
`

export const getAddNoteError = (config: {
  fieldName?: string
  maxContentLength: number
  shouldContainAtLeastOneChar?: boolean
  text: string
}) => {
  const defaults = {
    fieldName: 'notitie',
    shouldContainAtLeastOneChar: true,
  }

  const { fieldName, maxContentLength, shouldContainAtLeastOneChar, text } = {
    ...defaults,
    ...config,
  }

  if (shouldContainAtLeastOneChar && text.trim() === '') {
    return `De ${fieldName} mag niet leeg zijn`
  }

  if (text.length > maxContentLength) {
    return `Je hebt meer dan de maximale ${maxContentLength} tekens ingevoerd.`
  }

  return ''
}

const AddNote = forwardRef<HTMLTextAreaElement, AddNoteProps>(
  (
    {
      className,
      error,
      isStandalone,
      withToggle,
      label,
      maxContentLength,
      name,
      onBlur,
      onChange,
      onSubmit,
      onCancel,
      rows,
      value,
      ...rest
    },
    ref: any
  ) => {
    const [showForm, setShowForm] = useState(!withToggle || !isStandalone)
    const handleSubmit = useCallback(
      (event) => {
        event.preventDefault()

        if (typeof onSubmit === 'function') {
          const successfulSubmit = onSubmit(event, ref?.current?.value)

          if (successfulSubmit && withToggle) {
            setShowForm(false)
          }
        }
      },
      [onSubmit, ref, withToggle]
    )

    const handleCancel = useCallback(() => {
      withToggle && setShowForm(false)
      onCancel && onCancel()
    }, [onCancel, withToggle])

    useEffect(() => {
      if (!showForm || !ref?.current || !isStandalone) return

      ref.current.focus()
    }, [isStandalone, ref, showForm, name])

    if (!showForm) {
      return (
        <section data-testid="add-note">
          <Button
            type="button"
            variant="application"
            data-testid="add-note-new-note-button"
            onClick={() => setShowForm(true)}
          >
            Notitie toevoegen
          </Button>
        </section>
      )
    }
    return (
      <section className={className} data-testid="add-note">
        <TextArea
          data-testid="add-note-text"
          errorMessage={error}
          id="addNoteText"
          maxContentLength={maxContentLength}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          ref={ref}
          rows={rows}
          value={value || ''}
          {...rest}
        />

        {isStandalone && (
          <>
            <NoteButton
              data-testid="add-note-save-note-button"
              onClick={handleSubmit}
              type="submit"
              variant="secondary"
            >
              Opslaan
            </NoteButton>

            <NoteButton
              data-testid="add-note-cancel-note-button"
              variant="tertiary"
              type="button"
              onClick={handleCancel}
            >
              Annuleer
            </NoteButton>
          </>
        )}
      </section>
    )
  }
)

AddNote.defaultProps = {
  className: '',
  isStandalone: true,
  label: 'Notitie toevoegen',
  rows: 10,
  withToggle: true,
}

export default AddNote
