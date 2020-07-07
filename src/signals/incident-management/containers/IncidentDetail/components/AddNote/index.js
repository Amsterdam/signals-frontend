import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import Button from 'components/Button';
import TextArea from 'components/TextArea';
import Label from 'components/Label';
import IncidentDetailContext from '../../context';
import { PATCH_TYPE_NOTES } from '../../constants';

const NewNoteButton = styled(Button)`
  margin: ${themeSpacing(2, 2, 2, 0)};
`;

const NoteButton = styled(Button)`
  margin: ${themeSpacing(8, 2, 4, 0)};
`;

const AddNote = () => {
  const { dispatch } = useContext(IncidentDetailContext);
  const areaRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState('');

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (note.trim() === '') return;

      const notes = [{ text: note }];

      dispatch({
        type: PATCH_TYPE_NOTES,
        patch: { notes },
      });

      setNote('');
      setShowForm(false);
    },
    [dispatch, note]
  );

  const onChange = useCallback(
    event => {
      const value = event.target.value;

      setNote(value);
    },
    [setNote]
  );

  useEffect(() => {
    if (!showForm) return;

    areaRef.current.focus();
  }, [showForm]);

  if (!showForm) {
    return (
      <section>
        <NewNoteButton
          data-testid="addNoteNewNoteButton"
          variant="application"
          type="button"
          onClick={() => setShowForm(true)}
        >
          Notitie toevoegen
        </NewNoteButton>
      </section>
    );
  }

  return (
    <section>
      <form action="">
        <Label htmlFor="addNoteText">Notitie toevoegen</Label>
        <TextArea id="addNoteText" ref={areaRef} onChange={onChange} rows={10} data-testid="addNoteText" value={note} />
        <NoteButton
          data-testid="addNoteSaveNoteButton"
          disabled={!note}
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
          Annuleren
        </NoteButton>
      </form>
    </section>
  );
};

export default AddNote;
