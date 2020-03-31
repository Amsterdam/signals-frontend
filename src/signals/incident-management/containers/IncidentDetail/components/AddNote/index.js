import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, themeSpacing } from '@datapunt/asc-ui';

import TextArea from 'components/TextArea';
import Label from 'components/Label';
import { PATCH_TYPE_NOTES } from 'models/incident/constants';

const NewNoteButton = styled(Button)`
  margin: ${themeSpacing(2, 2, 2, 0)};
`;

const SaveNoteButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`;

const AddNote = ({ id, onPatchIncident }) => {
  const areaRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState('');

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      const notes = [{ text: note }];

      onPatchIncident({
        id,
        type: PATCH_TYPE_NOTES,
        patch: { notes },
      });

      setShowForm(false);
    },
    [id, onPatchIncident, note]
  );

  const onChange = useCallback(
    event => {
      const value = event.target.value.trim();

      setNote(value);
    },
    [setNote]
  );

  useEffect(() => {
    if (!showForm) return;

    areaRef.current.focus();
  }, [showForm]);

  return (
    <section>
      {showForm ? (
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

          <SaveNoteButton
            data-testid="addNoteSaveNoteButton"
            disabled={!note}
            onClick={handleSubmit}
            type="submit"
            variant="secondary"
          >
            Opslaan
          </SaveNoteButton>

          <Button
            data-testid="addNoteCancelNoteButton"
            variant="tertiary"
            type="button"
            onClick={() => setShowForm(false)}
          >
            Annuleren
          </Button>
        </form>
      ) : (
        <NewNoteButton
          data-testid="addNoteNewNoteButton"
          variant="application"
          type="button"
          onClick={() => setShowForm(true)}
        >
          Notitie toevoegen
        </NewNoteButton>
      )}
    </section>
  );
};

AddNote.propTypes = {
  id: PropTypes.string.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
};

export default AddNote;
