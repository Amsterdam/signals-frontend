import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import categories from 'utils/__tests__/fixtures/categories.json';

import DefaultTextsForm from './index';

describe('<DefaultTextsForm />', () => {
  let props;

  beforeEach(() => {
    props = {
      defaultTexts: [],
      subCategories: categories.sub,
      categoryUrl: '',
      state: 'o',

      onSubmitTexts: jest.fn(),
      onOrderDefaultTexts: jest.fn(),
      onSaveDefaultTextsItem: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render form correctly', () => {
    const fields = [...Array(10).keys()];
    const { queryByTestId } = render(
      withAppContext(<DefaultTextsForm {...props} />)
    );

    expect(queryByTestId('defaultTextFormForm')).not.toBeNull();

    fields.forEach(i => {
      expect(queryByTestId(`title${i}`)).not.toBeNull();
      expect(queryByTestId(`text${i}`)).not.toBeNull();
    });

    expect(queryByTestId('defaultTextFormSubmitButton')).not.toBeNull();
  });

  describe('events', () => {
    it('should trigger save default texts when a new title has been entered', () => {
      const { getByTestId } = render(
        withAppContext(<DefaultTextsForm {...props} />)
      );

      const newTitle = 'Titel ipsum';
      const event = {
        target: {
          value: newTitle,
        },
      };
      fireEvent.change(getByTestId('title4'), event);

      expect(props.onSaveDefaultTextsItem).toHaveBeenCalledWith({
        index: 4,
        data: {
          text: '',
          title: newTitle,
        },
      });
    });
  });

  it('should trigger save default texts when a new text has been entered', () => {
    const { getByTestId } = render(
      withAppContext(<DefaultTextsForm {...props} />)
    );

    const newText = 'lorem ipsum';
    const event = {
      target: {
        value: newText,
      },
    };
    fireEvent.change(getByTestId('text1'), event);

    expect(props.onSaveDefaultTextsItem).toHaveBeenCalledWith({
      index: 1,
      data: {
        text: newText,
        title: '',
      },
    });
  });
});

