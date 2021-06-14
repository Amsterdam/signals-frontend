// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useCallback, useEffect, useState, useRef, useContext } from 'react'
import styled from 'styled-components'
import { themeSpacing, ErrorMessage } from '@amsterdam/asc-ui'

import Button from 'components/Button'
import TextArea from 'components/TextArea'
import Label from 'components/Label'
import IncidentDetailContext from '../../context'
import { PATCH_TYPE_NOTES } from '../../constants'

const Section = styled.section`
  margin: ${themeSpacing(2, 2, 2, 0)};
`

const NoteButton = styled(Button)`
  margin: ${themeSpacing(8, 2, 4, 0)};
`

const StyledErrorMessage = styled(ErrorMessage)`
  font-family: Avenir Next LT W01 Demi;
  font-weight: normal;
`

const AddNote = () => {
  const { update } = useContext(IncidentDetailContext)
  const areaRef = useRef(null)
  const [showForm, setShowForm] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState()

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      if (note.trim() === '') {
        setError('Dit veld is verplicht')
        return
      }

      const notes = [{ text: note }]

      update({
        type: PATCH_TYPE_NOTES,
        patch: { notes },
      })

      setNote('')
      setShowForm(false)
    },
    [update, note]
  )

  const onChange = useCallback(
    (event) => {
      const value = event.target.value

      if (value.trim() !== '') {
        setError('')
      }

      setNote(value)
    },
    [setNote, setError]
  )

  useEffect(() => {
    if (!showForm) return

    areaRef.current.focus()
  }, [showForm])

  if (!showForm) {
    return (
      <Section>
        <Button
          type="button"
          variant="application"
          data-testid="addNoteNewNoteButton"
          onClick={() => setShowForm(true)}
        >
          Notitie toevoegen
        </Button>
      </Section>
    )
  }

  return (
    <Section>
      <form action="">
        <Label htmlFor="addNoteText">Notitie toevoegen</Label>
        <TextArea
          id="addNoteText"
          ref={areaRef}
          onChange={onChange}
          rows={10}
          data-testid="addNoteText"
          value={note}
        />

        {error && <StyledErrorMessage data-testid="error" message={error} />}

        <NoteButton
          data-testid="addNoteSaveNoteButton"
          onClick={handleSubmit}
          type="submit"
          variant="secondary"
        >
          Opslaan
        </NoteButton>

        <NoteButton
          data-testid="addNoteCancelNoteButton"
          variant="tertiary"
          type="button"
          onClick={() => setShowForm(false)}
        >
          Annuleer
        </NoteButton>
      </form>
    </Section>
  )
}

export default AddNote
