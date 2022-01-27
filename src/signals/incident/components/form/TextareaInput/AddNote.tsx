import { useState, useCallback, useRef } from 'react'

import GenericAddNote, { getAddNoteError } from 'components/AddNote'

import type { FC, FocusEvent } from 'react'
import type { AddNoteProps } from 'components/AddNote/AddNote'

const AddNote: FC<AddNoteProps> = ({ maxContentLength, onBlur, ...props }) => {
  const [error, setError] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const onNoteBlur = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      const text = event.target.value.trim()

      if (!text) return

      if (maxContentLength) {
        const validationError = getAddNoteError({
          maxContentLength,
          text,
          shouldContainAtLeastOneChar: false,
        })

        if (validationError !== '') {
          setError(validationError)
          return
        }
      }

      onBlur && onBlur(event)
    },
    [maxContentLength, onBlur]
  )

  const onChange = useCallback((event) => {
    const { value } = event.target

    if (value.trim() !== '') {
      setError('')
    }
  }, [])

  return (
    <GenericAddNote
      {...props}
      error={error}
      maxContentLength={maxContentLength}
      onChange={onChange}
      onBlur={onNoteBlur}
      ref={textAreaRef}
      isStandalone={false}
      rows={5}
    />
  )
}

export default AddNote
