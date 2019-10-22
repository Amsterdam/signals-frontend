import React from 'react';
import {
  render,
} from '@testing-library/react';
import { withAppContext } from 'test/utils';
import incident from 'utils/__tests__/fixtures/incident.json';

import { REQUEST_INCIDENT } from 'models/incident/constants';
import { SPLIT_INCIDENT } from './constants';

import { IncidentSplitContainer, mapDispatchToProps } from './index';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';

describe('<IncidentSplitContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '42',
      categories: {
        sub: [],
      },
      incidentModel: {
        incident,
        attachments: [],
        stadsdeelList,
        priorityList,
        loading: false,
      },
      onRequestIncident: jest.fn(),
      onRequestAttachments: jest.fn(),
      onSplitIncident: jest.fn(),
      onGoBack: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryAllByTestId } = render(
        withAppContext(<IncidentSplitContainer {...props} />)
      );

      expect(queryByTestId('splitDetailTitle')).toHaveTextContent(/^Melding 6666$/);
      expect(queryAllByTestId('incidentPartTitle')[0]).toHaveTextContent(/^Deelmelding 1$/);
      expect(queryAllByTestId('incidentPartTitle')[1]).toHaveTextContent(/^Deelmelding 2$/);
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onRequestIncident(42);
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_INCIDENT, payload: 42 });
    });

    it('onSplitIncident', () => {
      mapDispatchToProps(dispatch).onSplitIncident(42);
      expect(dispatch).toHaveBeenCalledWith({ type: SPLIT_INCIDENT, payload: 42 });
    });

    it('onGoBack', () => {
      mapDispatchToProps(dispatch).onGoBack();
      expect(dispatch).toHaveBeenCalledWith({ type: '@@router/CALL_HISTORY_METHOD', payload: { args: [], method: 'goBack' } });
    });
  });
});
