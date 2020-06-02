import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import AddNote from './index';

describe('<AddNote />', () => {
  const props = {
    id: '42',
    onPatchIncident: jest.fn(),
  };

  describe('show value', () => {
    it('should show the form ', () => {
      const { getByTestId, queryByTestId } = render(withAppContext(<AddNote {...props} />));

      expect(getByTestId('addNoteNewNoteButton')).toBeInTheDocument();
      expect(queryByTestId('addNoteSaveNoteButton')).not.toBeInTheDocument();

      act(() => {
        fireEvent.click(getByTestId('addNoteNewNoteButton'));
      });

      expect(getByTestId('addNoteSaveNoteButton')).toBeInTheDocument();
      expect(queryByTestId('addNoteNewNoteButton')).not.toBeInTheDocument();
      expect(getByTestId('addNoteCancelNoteButton')).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByTestId('addNoteCancelNoteButton'));
      });

      expect(queryByTestId('addNoteSaveNoteButton')).not.toBeInTheDocument();
      expect(queryByTestId('addNoteCancelNoteButton')).not.toBeInTheDocument();
      expect(queryByTestId('addNoteNewNoteButton')).toBeInTheDocument();
    });
  });

  it('should call onPatchIncident', async () => {
    const { getByTestId, findByTestId } = render(withAppContext(<AddNote {...props} />));

    act(() => {
      fireEvent.click(getByTestId('addNoteNewNoteButton'));
    });

    const addNoteTextArea = await findByTestId('addNoteText');
    const value = 'Here be a note';
    const saveNoteButton = getByTestId('addNoteSaveNoteButton');

    act(() => {
      fireEvent.change(addNoteTextArea, { target: { value } });
    });

    act(() => {
      fireEvent.click(saveNoteButton);
    });

    expect(props.onPatchIncident).toHaveBeenCalledWith({
      id: '42',
      type: 'notes',
      patch: {
        notes: [{ text: value }],
      },
    });
  });

  it('should clear the textarea', async () => {
    const { getByTestId, findByTestId } = render(withAppContext(<AddNote {...props} />));
    const value = 'Here be a note';

    act(() => {
      fireEvent.click(getByTestId('addNoteNewNoteButton'));
    });

    const addNoteTextArea = await findByTestId('addNoteText');

    expect(addNoteTextArea.value).toEqual('');

    const saveNoteButton = getByTestId('addNoteSaveNoteButton');

    act(() => {
      fireEvent.change(addNoteTextArea, { target: { value } });
    });

    expect(addNoteTextArea.value).toEqual(value);

    act(() => {
      fireEvent.click(saveNoteButton);
    });

    const newNoteButton = await findByTestId('addNoteNewNoteButton');

    act(() => {
      fireEvent.click(newNoteButton);
    });

    expect(getByTestId('addNoteText').value).toEqual('');
  });
});
