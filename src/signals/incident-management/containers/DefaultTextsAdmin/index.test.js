import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import {  defaultTextsOptionList } from 'signals/incident-management/definitions/statusList';

import {
  FETCH_DEFAULT_TEXTS,
  STORE_DEFAULT_TEXTS,
  ORDER_DEFAULT_TEXTS,
  SAVE_DEFAULT_TEXTS_ITEM,
} from './constants';

import DefaultTextsAdmin, { mapDispatchToProps } from ".";

describe('<DefaultTextsAdmin />', () => {
  let props;

  beforeEach(() => {
    props = {
      defaultTextsAdmin: {
        defaultTexts: [{
          title: 'Accu',
          text: 'accutekst',
        }],
        defaultTextsOptionList,
        categoryUrl: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
        state: 'o',
      },
      categories: {},
      onFetchDefaultTexts: jest.fn(),
      onSubmitTexts: jest.fn(),
      onOrderDefaultTexts: jest.fn(),
      onSaveDefaultTextsItem: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId } = render(
        withAppContext(<DefaultTextsAdmin {...props} />)
      );

      expect(queryByTestId('defaultTextFormForm')).not.toBeNull();
      expect(queryByTestId('selectFormForm')).not.toBeNull();
    });
  });
  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request fetch default texts', () => {
      const payload = {
        category_url: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
        state: 'o',
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      };
      mapDispatchToProps(dispatch).onFetchDefaultTexts(payload);
      expect(dispatch).toHaveBeenCalledWith({ type: FETCH_DEFAULT_TEXTS , payload });
    });

    it('should request store default texts', () => {
      const payload = {
        post: {
          state: 'o',
          templates: [
            {
              title: 'test',
              text: 'Lorem ipsum dolor sid amet',
            },
          ],
        },
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      };
      mapDispatchToProps(dispatch).onSubmitTexts(payload);
      expect(dispatch).toHaveBeenCalledWith({ type: STORE_DEFAULT_TEXTS , payload });
    });

    it('should request fetch default texts', () => {
      const payload = {
        index: 0,
        type: 'down',
      };
      mapDispatchToProps(dispatch).onOrderDefaultTexts(payload);
      expect(dispatch).toHaveBeenCalledWith({ type: ORDER_DEFAULT_TEXTS, payload });
    });

    it('should request fetch default texts', () => {
      const payload = {
        index: 1,
        data: {
          title: 'test',
          text: 'Lorem ipsum dolor sid amet',
        },
      };
      mapDispatchToProps(dispatch).onSaveDefaultTextsItem(payload);
      expect(dispatch).toHaveBeenCalledWith({ type: SAVE_DEFAULT_TEXTS_ITEM, payload });
    });
  });
});
