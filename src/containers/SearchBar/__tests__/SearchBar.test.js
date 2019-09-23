import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, cleanup, createEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import SearchBarContainer, { SearchBarComponent } from '../';

describe.skip('containers/SearchBar', () => {
  afterEach(cleanup);

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<SearchBarContainer />));

    const props = tree.find(SearchBarComponent).props();

    expect(props.onRequestIncidents).toBeDefined();
    expect(props.onSetSearchQuery).toBeDefined();
    expect(props.query).toBeDefined();
  });

  it('should only accept numeric characters in the search field', () => {
    const onRequestIncidents = () => {};
    const onSetSearchQuery = () => {};
    const query = '';

    const { queryByTestId } = render(
      withAppContext(
        <SearchBarComponent
          onRequestIncidents={onRequestIncidents}
          onSetSearchQuery={onSetSearchQuery}
          query={query}
        />,
      ),
    );

    const input = queryByTestId('searchBar').querySelector('input');

    // simulate the input of allowed keys
    const numericKeyCodes = [...Array(58).keys()].slice(48);
    numericKeyCodes.forEach((keyCode, value) => {
      fireEvent.change(input, { target: { value, keyCode } });
      expect(parseInt(input.value, 10)).toEqual(value);
    });

    // simulate the input of navigational keys
    const navKeyCodes = [
      8, // backspace
      37, // left
      39, // right
      46, // delete
    ];
    navKeyCodes.forEach(keyCode => {
      const myEvent = createEvent.change(input, { target: { keyCode } });
      const preventDefaultSpy = jest.spyOn(myEvent, 'preventDefault');
      fireEvent(input, myEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    // simulate other keys
    const invalidKeyCodes = [1, 2, 3, 4, 58, 60, 90];
    invalidKeyCodes.forEach(keyCode => {
      const myEvent = createEvent.keyDown(input, { target: { keyCode } });
      const preventDefaultSpy = jest.spyOn(myEvent, 'preventDefault');
      fireEvent(input, myEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  it('should call searchSubmit handler', () => {
    const onRequestIncidents = jest.fn();
    const onSetSearchQuery = jest.fn();
    const query = '';

    const { queryByTestId, rerender } = render(
      withAppContext(
        <SearchBarComponent
          onRequestIncidents={onRequestIncidents}
          onSetSearchQuery={onSetSearchQuery}
          query={query}
        />,
      ),
    );

    const formInput = queryByTestId('searchBar').querySelector('input');
    const formSubmitBtn = queryByTestId('searchBar').querySelector('button');

    fireEvent.change(formInput, { target: { value: '1234' } });
    fireEvent.click(formSubmitBtn);

    expect(onRequestIncidents).toHaveBeenCalled();
    expect(onSetSearchQuery).toHaveBeenCalled();

    onRequestIncidents.mockReset();
    onSetSearchQuery.mockReset();

    rerender(
      withAppContext(
        <SearchBarComponent
          onRequestIncidents={onRequestIncidents}
          onSetSearchQuery={onSetSearchQuery}
          query={query}
        />,
      ),
    );

    const submitBtn = queryByTestId('searchBar').querySelector('button');

    fireEvent.click(submitBtn);

    expect(onRequestIncidents).not.toHaveBeenCalled();
    expect(onSetSearchQuery).not.toHaveBeenCalled();
  });
});
