import { useState, useContext, useCallback, useRef } from 'react'
import type { FC } from 'react'

import GenericAddNote, { getAddNoteError } from 'components/AddNote'

import { PATCH_TYPE_NOTES } from '../../constants'
import IncidentDetailContext from '../../context'

type AddNoteProps = {
  maxContentLength: number
  className?: string
  onClose: () => void
}

const AddNote: FC<AddNoteProps> = ({
  className,
  maxContentLength,
  onClose,
}) => {
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

      onClose()

      return true
    },
    [maxContentLength, update, onClose]
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
      onCancel={onClose}
      ref={textAreaRef}
      withToggle={false}
    />
  )
}

export default AddNote
