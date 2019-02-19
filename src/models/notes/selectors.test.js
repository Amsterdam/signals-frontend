import { fromJS } from 'immutable';
import makeSelectNotesModel from './selectors';

describe('makeSelectNotesModel', () => {
  const selector = makeSelectNotesModel();
  it('should select the notesModel', () => {
    const notesModel = {
      foo: 'bar'
    };

    const mockedState = fromJS({
      notesModel
    });
    expect(selector(mockedState)).toEqual(notesModel);
  });
});
