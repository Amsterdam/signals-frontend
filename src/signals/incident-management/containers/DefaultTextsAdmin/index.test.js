import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import { defaultTextsOptionList } from 'signals/incident-management/definitions/statusList';
import { subCategories } from 'utils/__tests__/fixtures';

import DefaultTextsAdmin, { DefaultTextsAdminContainer } from '.';

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

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<DefaultTextsAdmin />));

    const containerProps = tree.find(DefaultTextsAdminContainer).props();

    expect(containerProps.defaultTextsAdmin).toBeDefined();
    expect(containerProps.subCategories).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<DefaultTextsAdmin />));

    const containerProps = tree.find(DefaultTextsAdminContainer).props();

    expect(containerProps.onFetchDefaultTexts).not.toBeUndefined();
    expect(typeof containerProps.onFetchDefaultTexts).toEqual('function');

    expect(containerProps.onSubmitTexts).not.toBeUndefined();
    expect(typeof containerProps.onSubmitTexts).toEqual('function');

    expect(containerProps.onOrderDefaultTexts).not.toBeUndefined();
    expect(typeof containerProps.onOrderDefaultTexts).toEqual('function');
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, rerender } = render(
        withAppContext(<DefaultTextsAdminContainer {...props} />)
      );

      expect(queryByTestId('spinner')).toBeInTheDocument();
      expect(queryByTestId('defaultTextFormForm')).not.toBeInTheDocument();
      expect(queryByTestId('selectFormForm')).not.toBeInTheDocument();

      rerender(
        withAppContext(
          <DefaultTextsAdminContainer
            {...props}
            subCategories={subCategories}
          />
        )
      );

      expect(queryByTestId('spinner')).not.toBeInTheDocument();
      expect(queryByTestId('defaultTextFormForm')).toBeInTheDocument();
      expect(queryByTestId('selectFormForm')).toBeInTheDocument();
    });
  });
});
