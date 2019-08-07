import React from 'react';
import { render } from '@testing-library/react';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { withAppContext } from 'test/utils';

import MetaList from './index';

jest.mock('../../components/Highlight', () => () => <div data-testid="meta-list-highlight" />);
jest.mock('shared/services/string-parser/string-parser');

describe('<MetaList />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: {
        created_at: '',
        category: {
          category_url: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overig-horecabedrijven',
          sub: 'Overig bedrijven / horeca',
          sub_slug: 'overig-horecabedrijven',
          main: 'Overlast Bedrijven en Horeca',
          main_slug: 'overlast-bedrijven-en-horeca',
          departments: 'VTH',
          created_by: null,
          text: null
        },
        source: 'public-api',
        status: {
          status: 'm'
        },
        priority: {
          priority: 'normal'
        },
        _links: {}
      },
      subcategories: [],
      priorityList: [],
      onPatchIncident: jest.fn(),
      onEditStatus: jest.fn(),
      onShowAttachment: jest.fn()
    };

    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:56');
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryAllByTestId } = render(
        <MetaList {...props} />
      );

      expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(queryByTestId('meta-list-date-value')).toHaveTextContent('21-07-1970 11:56');

      expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('meta-list-source-value')).toHaveTextContent('public-api');

      expect(queryAllByTestId('meta-list-highlight')).toHaveLength(5);
    });

    it('should render correctly with parent', () => {
      props.incident._links['sia:parent'] = { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3094' };

      const { queryByTestId } = render(
        withAppContext(<MetaList {...props} />)
      );

      expect(queryByTestId('meta-list-parent-definition')).toHaveTextContent(/^Oorspronkelijke melding$/);
      expect(queryByTestId('meta-list-parent-value')).toHaveTextContent('3094');
    });

    it('should render correctly with children', () => {
      props.incident._links['sia:children'] = [{ href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3095' }, { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3096' }];

      const { queryByTestId } = render(
        withAppContext(<MetaList {...props} />)
      );

      expect(queryByTestId('meta-list-children-definition')).toHaveTextContent(/^Gesplitst in$/);
      expect(queryByTestId('meta-list-children-value')).toHaveTextContent('3095 3096');
    });
  });
});
