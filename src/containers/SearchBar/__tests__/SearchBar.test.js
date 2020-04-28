import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import SearchBarContainer, { SearchBarComponent } from '..';

describe('containers/SearchBar', () => {
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<SearchBarContainer />));

    const props = tree.find(SearchBarComponent).props();

    expect(props.query).toBeDefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<SearchBarContainer />));

    const containerProps = tree.find(SearchBarComponent).props();

    expect(containerProps.setSearchQueryAction).toBeDefined();
    expect(typeof containerProps.setSearchQueryAction).toEqual('function');

    expect(containerProps.resetSearchQueryAction).toBeDefined();
    expect(typeof containerProps.resetSearchQueryAction).toEqual('function');
  });

  describe('callback handlers', () => {
    const setSearchQueryAction = jest.fn();
    const resetSearchQueryAction = jest.fn();

    afterEach(jest.resetAllMocks);

    it('should call searchSubmit handler', () => {
      const query = '';

      const { queryByTestId } = render(
        withAppContext(
          <SearchBarComponent
            setSearchQueryAction={setSearchQueryAction}
            resetSearchQueryAction={resetSearchQueryAction}
            query={query}
          />,
        ),
      );

      const formInput = queryByTestId('searchBar').querySelector('input');
      const formSubmitBtn = queryByTestId('searchBar').querySelector('button');

      fireEvent.change(formInput, { target: { value: '1234' } });

      expect(setSearchQueryAction).not.toHaveBeenCalled();

      fireEvent.click(formSubmitBtn);

      expect(setSearchQueryAction).toHaveBeenCalledWith('1234');
    });

    it('should call onChange handler', () => {
      const query = 'Foo baz barrr';

      const { queryByTestId } = render(
        withAppContext(
          <SearchBarComponent
            setSearchQueryAction={setSearchQueryAction}
            resetSearchQueryAction={resetSearchQueryAction}
            query={query}
          />,
        ),
      );

      expect(resetSearchQueryAction).not.toHaveBeenCalledWith();

      const formInput = queryByTestId('searchBar').querySelector('input');
      fireEvent.change(formInput, { target: { value: '' } });

      expect(resetSearchQueryAction).toHaveBeenCalledWith();
    });


    it('should reset query on clear', () => {
      const query = 'Foo baz barrr';

      const { container } = render(
        withAppContext(
          <SearchBarComponent
            setSearchQueryAction={setSearchQueryAction}
            resetSearchQueryAction={resetSearchQueryAction}
            query={query}
          />,
        ),
      );

      expect(resetSearchQueryAction).not.toHaveBeenCalledWith();

      act(() => {
        fireEvent.click(container.querySelector('button[aria-label="Close"]'));
      });

      expect(resetSearchQueryAction).toHaveBeenCalledWith();
    });
  });
});
