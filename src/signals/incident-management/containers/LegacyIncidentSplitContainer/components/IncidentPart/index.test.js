import React from 'react';
import { render } from '@testing-library/react';
import { FormControl } from 'react-reactive-form';

import { withAppContext } from 'test/utils';
import incident from 'utils/__tests__/fixtures/incident.json';
import * as modelSelectors from 'models/categories/selectors';
import categoriesFixture from 'utils/__tests__/fixtures/categories_private.json';

import IncidentPart from '.';

jest.mock('containers/App/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/selectors'),
}));

const subCategories = categoriesFixture.results
  .filter(modelSelectors.filterForSub)
  // mapping subcategories to prevent a warning about non-unique keys rendered by the SelectInput element 🙄
  .map(subCat => ({ ...subCat, key: subCat._links.self.href }));

describe('<IncidentPart />', () => {
  let props;

  beforeEach(() => {
    jest.spyOn(modelSelectors, 'makeSelectSubCategories').mockImplementation(() => subCategories);

    const splitForm = {
      get: jest.fn().mockImplementation(() => new FormControl()),
    };

    props = {
      index: '2',
      incident,
      attachments: [],
      splitForm,
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryByText, rerender } = render(withAppContext(<IncidentPart {...props} />));

      expect(queryByTestId('incidentPartTitle')).toHaveTextContent(/^Deelmelding 2$/);
      expect(queryByText('Subcategorie')).toBeInTheDocument();
      expect(queryByText('Omschrijving')).toBeInTheDocument();
      expect(queryByText('Notitie')).toBeInTheDocument();
      expect(queryByText('Urgentie')).toBeInTheDocument();
      expect(queryByText('Type')).toBeInTheDocument();
      expect(queryByText("Foto's toevoegen")).not.toBeInTheDocument();

      props.attachments.push({ location: 'mock-image' });
      rerender(withAppContext(<IncidentPart {...props} />));

      expect(queryByText("Foto's toevoegen")).toBeInTheDocument();
    });

    it('should wait till all categories have been loaded', () => {
      const { container, rerender, unmount } = render(withAppContext(<IncidentPart {...props} />));

      expect(container.querySelector('select')).toBeInTheDocument();

      jest.spyOn(modelSelectors, 'makeSelectSubCategories').mockImplementation(() => null);

      unmount();

      rerender(withAppContext(<IncidentPart {...props} />));

      expect(container.querySelector('select')).not.toBeInTheDocument();
    });

    it('should render no form components when form is not available', () => {
      props.splitForm = undefined;
      const { queryByTestId, queryByText } = render(withAppContext(<IncidentPart {...props} />));

      expect(queryByTestId('incidentPartTitle')).toBeInTheDocument();
      expect(queryByText('Subcategorie')).not.toBeInTheDocument();
      expect(queryByText('Omschrijving')).not.toBeInTheDocument();
      expect(queryByText('Notitie')).not.toBeInTheDocument();
      expect(queryByText('Urgentie')).not.toBeInTheDocument();
      expect(queryByText('Type')).not.toBeInTheDocument();
      expect(queryByText("Foto's toevoegen")).not.toBeInTheDocument();
    });
  });
});
