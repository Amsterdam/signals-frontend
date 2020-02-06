import React from 'react';
import {
  render,
} from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext } from 'test/utils';
import incident from 'utils/__tests__/fixtures/incident.json';

import { REQUEST_INCIDENT } from 'models/incident/constants';
import { SPLIT_INCIDENT } from './constants';

import { IncidentSplitContainer, mapDispatchToProps } from './index';
import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

describe('<IncidentSplitContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
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

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      id: '42',
    }));
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryAllByTestId } = render(
        withAppContext(<IncidentSplitContainer {...props} />)
      );

      expect(queryByTestId('splitDetailTitle')).toHaveTextContent(new RegExp(`^Melding ${incident.id}$`));
      expect(queryAllByTestId('incidentPartTitle')[0]).toHaveTextContent(/^Deelmelding 1$/);
      expect(queryAllByTestId('incidentPartTitle')[1]).toHaveTextContent(/^Deelmelding 2$/);

      expect(props.onRequestIncident).toHaveBeenCalledWith('42');
      expect(props.onRequestAttachments).toHaveBeenCalledWith('42');
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
