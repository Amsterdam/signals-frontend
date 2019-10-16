import React from 'react';
import {
  render,
} from '@testing-library/react';
import { FormControl } from 'react-reactive-form';

import incident from 'utils/__tests__/fixtures/incident.json';

import IncidentPart from './index';
import priorityList from '../../../../definitions/priorityList';

describe('<IncidentPart />', () => {
  let props;

  beforeEach(() => {
    const splitForm = {
      get: jest.fn().mockImplementation(() => new FormControl())
    };

    props = {
      index: '2',
      incident,
      attachments: [],
      subcategories: [{
        key: 'key',
        value: 'value',
        slug: 'slug'
      }],
      priorityList,
      splitForm
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryByText, rerender } = render(
        <IncidentPart {...props} />
      );
      expect(queryByTestId('incidentPartTitle')).toHaveTextContent(/^Deelmelding 2$/);
      expect(queryByText('Subcategorie')).not.toBeNull();
      expect(queryByText('Omschrijving')).not.toBeNull();
      expect(queryByText('Notitie')).not.toBeNull();
      expect(queryByText('Urgentie')).not.toBeNull();
      expect(queryByText('Foto\'s toevoegen')).toBeNull();

      props.attachments.push({ location: 'mock-image' });
      rerender(
        <IncidentPart {...props} />
      );

      expect(queryByText('Foto\'s toevoegen')).not.toBeNull();
    });

    it('should render no form components when form is not available', () => {
      props.splitForm = undefined;
      const { queryByTestId, queryByText } = render(
        <IncidentPart {...props} />
      );
      expect(queryByTestId('incidentPartTitle')).toBeNull();
      expect(queryByText('Subcategorie')).toBeNull();
      expect(queryByText('Omschrijving')).toBeNull();
      expect(queryByText('Notitie')).toBeNull();
      expect(queryByText('Urgentie')).toBeNull();
      expect(queryByText('Foto\'s toevoegen')).toBeNull();
    });
  });
});
