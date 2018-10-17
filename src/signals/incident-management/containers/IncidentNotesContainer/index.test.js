import React from 'react';
import { shallow } from 'enzyme';

import { IncidentNotesContainer, mapDispatchToProps } from './index';
import { REQUEST_NOTES_LIST, REQUEST_NOTE_CREATE } from './constants';

describe('<IncidentNotesContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      incidentNotesContainer: {
        incident: {},
        incidentNotesList: [{
          state: 'm'
        }]
      },
      onRequestNotesList: jest.fn(),
      onRequestNoteCreate: jest.fn()
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <IncidentNotesContainer {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();


    it('should request the status list', () => {
      mapDispatchToProps(dispatch).onRequestNotesList({});
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_NOTES_LIST, payload: {} });
    });

    it('should request the status create', () => {
      mapDispatchToProps(dispatch).onRequestNoteCreate({ status: {} });
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_NOTE_CREATE, payload: { status: {} } });
    });
  });
});
