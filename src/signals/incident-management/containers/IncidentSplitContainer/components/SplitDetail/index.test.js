import React from 'react';
import {
  render,
} from '@testing-library/react';

import { string2date, string2time } from 'shared/services/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import incident from 'utils/__tests__/fixtures/incident.json';

import SplitDetail from '.';

jest.mock('shared/services/string-parser');
jest.mock('shared/services/list-helper/list-helper');

describe('<SplitDetail />', () => {
  const props = {
    incident,
    onPatchIncident: jest.fn(),
    onEditStatus: jest.fn(),
    onShowAttachment: jest.fn(),
  };

  beforeEach(() => {
    string2date.mockImplementation(() => '14-01-1969');
    string2time.mockImplementation(() => '11:56');
    getListValueByKey.mockImplementation(() => 'Centrum');
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      props.incident.category.departments = '';
      const { queryByTestId, rerender } = render(
        <SplitDetail {...props} />
      );

      expect(queryByTestId('splitDetailTitleDate')).toHaveTextContent(/^Datum$/);
      expect(queryByTestId('splitDetailValueDate')).toHaveTextContent(/^14-01-1969$/);

      expect(queryByTestId('splitDetailTitleTime')).toHaveTextContent(/^Tijd$/);
      expect(queryByTestId('splitDetailValueTime')).toHaveTextContent(/^11:56$/);

      expect(queryByTestId('splitDetailTitleDateOverlast')).toHaveTextContent(/^Datum overlast$/);
      expect(queryByTestId('splitDetailValueDateOverlast')).toHaveTextContent(/^14-01-1969$/);

      expect(queryByTestId('splitDetailTitleTimeOverlast')).toHaveTextContent(/^Tijd overlast$/);
      expect(queryByTestId('splitDetailValueTimeOverlast')).toHaveTextContent(/^11:56$/);


      expect(queryByTestId('splitDetailTitleStadsdeel')).toHaveTextContent(/^Stadsdeel$/);
      expect(queryByTestId('splitDetailValueStadsdeel')).toHaveTextContent(/^Centrum$/);

      expect(queryByTestId('splitDetailTitleAddress')).toHaveTextContent(/^Adres$/);
      expect(queryByTestId('splitDetailValueAddress')).toHaveTextContent(new RegExp(`^${incident.location.address_text}$`));

      expect(queryByTestId('splitDetailValueEmail')).toHaveTextContent(incident.reporter.email);

      expect(queryByTestId('splitDetailValuePhone')).toHaveTextContent(incident.reporter.phone);

      expect(queryByTestId('splitDetailTitleSource')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('splitDetailValueSource')).toHaveTextContent(incident.source);

      expect(queryByTestId('splitDetailTitleDepartment')).toBeNull();
      expect(queryByTestId('splitDetailValueDepartment')).toBeNull();

      props.incident.reporter.email = 'steve@apple.com';
      props.incident.reporter.phone = '1234567890';
      props.incident.category.departments = 'STW, THO';
      rerender(
        <SplitDetail {...props} />
      );

      expect(queryByTestId('splitDetailTitleEmail')).toHaveTextContent(/^E-mailadres$/);
      expect(queryByTestId('splitDetailValueEmail')).toHaveTextContent(/^steve@apple.com$/);

      expect(queryByTestId('splitDetailTitlePhone')).toHaveTextContent(/^Telefonnummer$/);
      expect(queryByTestId('splitDetailValuePhone')).toHaveTextContent(/^1234567890$/);

      expect(queryByTestId('splitDetailTitleDepartment')).toHaveTextContent(/^Verantwoordelijke afdeling$/);
      expect(queryByTestId('splitDetailValueDepartment')).toHaveTextContent(/^STW, THO$/);
    });
  });
});
