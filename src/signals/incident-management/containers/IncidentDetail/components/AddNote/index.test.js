import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import { PATCH_TYPE_NOTES } from '../../constants';
import IncidentDetailContext from '../../context';
import AddNote from './index';

const update = jest.fn();

const renderWithContext = () =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ update }}>
      <AddNote />
    </IncidentDetailContext.Provider>
  );

describe('<AddNote />', () => {
  beforeEach(() => {
    update.mockReset();
  });

  it('should show the form ', () => {
    const { getByTestId, queryByTestId } = render(renderWithContext());

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

  it('should call update', async () => {
    const { getByTestId, findByTestId } = render(renderWithContext());

    act(() => {
      fireEvent.click(getByTestId('addNoteNewNoteButton'));
    });

    const addNoteTextArea = await findByTestId('addNoteText');
    const value = 'Here be a note';
    const saveNoteButton = getByTestId('addNoteSaveNoteButton');

    act(() => {
      fireEvent.change(addNoteTextArea, { target: { value } });
    });

    expect(update).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(saveNoteButton);
    });

    expect(update).toHaveBeenCalledWith({
      type: PATCH_TYPE_NOTES,
      patch: {
        notes: [{ text: value }],
      },
    });
  });

  it('should not call update when note field is empty', async () => {
    const { getByTestId, findByTestId } = render(renderWithContext());

    act(() => {
      fireEvent.click(getByTestId('addNoteNewNoteButton'));
    });

    const addNoteTextArea = await findByTestId('addNoteText');
    const saveNoteButton = getByTestId('addNoteSaveNoteButton');

    act(() => {
      fireEvent.change(addNoteTextArea, { target: { value: '  ' } });
    });

    expect(update).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(saveNoteButton);
    });

    expect(update).not.toHaveBeenCalled();
  });

  it('should clear the textarea', async () => {
    const { getByTestId, findByTestId } = render(renderWithContext());
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
