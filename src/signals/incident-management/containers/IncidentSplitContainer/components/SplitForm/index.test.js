import React from 'react';
import {
  render,
  fireEvent,
} from '@testing-library/react';
import { withAppContext } from 'test/utils';

import SplitForm from './index';

import priorityList from '../../../../definitions/priorityList';

describe('<SplitForm />', () => {
  const mockCreate = {
    category: {
      sub_category: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/poep'
    },
    reuse_parent_image: true,
    text: undefined
  };
  const mockUpdate = {
    image: true,
    note: '',
    priority: 'high',
    subcategory: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/poep',
    text: undefined
  };
  let props;

  beforeEach(() => {
    props = {
      incident: {
        id: '42',
        category: {
          main_slug: 'afval',
          sub_slug: 'poep',
          category_url: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/poep',
        },
        priority: {
          priority: 'high'
        }
      },
      attachments: [],
      subcategories: [{
        key: 'poep',
        value: 'Poep',
        slug: 'poep'
      }],
      priorityList,
      onHandleCancel: jest.fn(),
      onHandleSubmit: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId } = render(
        withAppContext(<SplitForm {...props} />)
      );

      expect(queryByTestId('splitFormDisclaimer')).not.toBeNull();
      expect(queryByTestId('splitFormBottomDisclaimer')).not.toBeNull();
    });
  });

  describe('events', () => {
    it('should toggle visiblity of part 3 on and off and on again', () => {
      const { getByTestId, queryAllByTestId } = render(
        withAppContext(<SplitForm {...props} />)
      );

      fireEvent.click(getByTestId('splitFormPartAdd'));

      expect(queryAllByTestId('incidentPartTitle')[2]).toHaveTextContent(/^Deelmelding 3$/);

      fireEvent.click(getByTestId('splitFormPartRemove'));

      expect(queryAllByTestId('incidentPartTitle')[2]).toBeUndefined();
    });
  });

  it('should handle submit with 2 items', () => {
    const { getByTestId } = render(
      withAppContext(<SplitForm {...props} />)
    );

    fireEvent.click(getByTestId('splitFormSubmit'));

    expect(props.onHandleSubmit).toHaveBeenCalledWith({
      create: [mockCreate, mockCreate],
      id: props.incident.id,
      update: [mockUpdate, mockUpdate]
    });
  });

  it('should handle submit with 3 items', () => {
    const { getByTestId } = render(
      withAppContext(<SplitForm {...props} />)
    );

    fireEvent.click(getByTestId('splitFormPartAdd'));
    fireEvent.click(getByTestId('splitFormSubmit'));

    expect(props.onHandleSubmit).toHaveBeenCalledWith({
      create: [mockCreate, mockCreate, mockCreate],
      id: props.incident.id,
      update: [mockUpdate, mockUpdate, mockUpdate]
    });
  });

  it('should handle cancel', () => {
    const { getByTestId } = render(
      withAppContext(<SplitForm {...props} />)
    );

    fireEvent.click(getByTestId('splitFormCancel'));

    expect(props.onHandleCancel).toHaveBeenCalled();
  });
});
