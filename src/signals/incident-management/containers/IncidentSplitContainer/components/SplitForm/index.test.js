import React from 'react';
import {
  render,
  fireEvent,
} from '@testing-library/react';

import { withAppContext } from 'test/utils';
import incident from 'utils/__tests__/fixtures/incident.json';

import SplitForm from './index';

describe('<SplitForm />', () => {
  const mockCreate = {
    category: {
      sub_category: incident.category.category_url,
    },
    reuse_parent_image: true,
    text: incident.text,
    type: {
      code: 'SIG',
    },
  };
  const mockUpdate = {
    image: true,
    note: '',
    priority: incident.priority.priority,
    subcategory: incident.category.category_url,
    text: incident.text,
    type: 'SIG',
  };
  let props;

  beforeEach(() => {
    props = {
      incident,
      attachments: [],
      subcategories: [{
        key: 'poep',
        value: 'Poep',
        slug: 'poep',
      }],
      onHandleCancel: jest.fn(),
      onHandleSubmit: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId } = render(
        withAppContext(<SplitForm {...props} />)
      );

      expect(queryByTestId('splitFormDisclaimer')).toBeInTheDocument();
      expect(queryByTestId('splitFormBottomDisclaimer')).toBeInTheDocument();
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
      update: [mockUpdate, mockUpdate],
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
      update: [mockUpdate, mockUpdate, mockUpdate],
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
