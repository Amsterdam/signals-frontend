import { useState, useContext, useCallback, useRef } from 'react'

import GenericAddNote, { getAddNoteError } from 'components/AddNote'

import type { FC } from 'react'

import IncidentDetailContext from '../../context'
import { PATCH_TYPE_NOTES } from '../../constants'

type AddNoteProps = {
  maxContentLength: number
  className?: string
}

const AddNote: FC<AddNoteProps> = ({ className, maxContentLength }) => {
  const { update } = useContext(IncidentDetailContext)
  const [error, setError] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const onSubmit = useCallback(
    (event, text) => {
      event.preventDefault()

      if (!update || !text) return false

      const validationError = getAddNoteError({ maxContentLength, text })

      if (validationError !== '') {
        setError(validationError)
        return false
      }

      const notes = [{ text }]

      update({
        type: PATCH_TYPE_NOTES,
        patch: { notes },
      })

      return true
    },
    [maxContentLength, update]
  )

  const onChange = useCallback((event) => {
    const { value } = event.target

    if (value.trim() !== '') {
      setError('')
    }
  }, [])

  return (
    <GenericAddNote
      className={className}
      error={error}
      maxContentLength={maxContentLength}
      onChange={onChange}
      onSubmit={onSubmit}
      ref={textAreaRef}
    />
  )
}

export default AddNote
