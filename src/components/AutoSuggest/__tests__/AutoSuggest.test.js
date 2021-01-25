import React, { Fragment } from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import AutoSuggest, { INPUT_DELAY } from '..';
import JSONResponse from './mockResponse.json';

const mockResponse = JSON.stringify(JSONResponse);

const numOptionsDeterminer = data => data?.response?.docs?.length || 0;
const formatResponse = ({ response }) => response.docs.map(({ id, weergavenaam }) => ({ id, value: weergavenaam }));
const onSelect = jest.fn();
const url = '//some-service.com?q=';

const props = {
  numOptionsDeterminer,
  formatResponse,
  onSelect,
  url,
};

describe('src/components/AutoSuggest', () => {
  beforeEach(() => {
    fetch.mockResponse(mockResponse);
    onSelect.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    fetch.resetMocks();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render a combobox with input field', () => {
    const { container } = render(withAppContext(<AutoSuggest {...props} />));

    expect(container.querySelector('[role=combobox]')).toBeInTheDocument();

    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('aria-autocomplete')).toEqual('list');
    expect(input.getAttribute('id')).toBe('');
    expect(input.hasAttribute('disabled')).toBe(false);
  });

  it('should set an id on the input field', () => {
    const id = 'id';
    const { container } = render(withAppContext(<AutoSuggest {...{ ...props, id }} />));

    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('id')).toEqual(id);
  });

  it('should disable the input field', () => {
    const { container } = render(withAppContext(<AutoSuggest {...{ ...props, disabled: true }} />));

    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('should request external service', async () => {
    const { container, findByTestId } = render(withAppContext(<AutoSuggest {...props} />));
    const input = container.querySelector('input');

    input.focus();

    act(() => {
      fireEvent.change(input, { target: { value: 'A' } });
    });

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY);
    });

    await findByTestId('autoSuggest');

    expect(fetch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: 'Am' } });
    });

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY);
    });

    await findByTestId('autoSuggest');

    expect(fetch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: 'Ams' } });
    });

    await findByTestId('autoSuggest');

    expect(fetch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY);
    });

    await findByTestId('autoSuggest');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${url}Ams`, expect.anything());
  });

  it('should show a value without sending a request to the external service', async () => {
    const { container, findByTestId, rerender } = render(withAppContext(<AutoSuggest {...props} />));
    const input = container.querySelector('input');

    await findByTestId('autoSuggest');

    input.focus();

    expect(input.value).toEqual('');

    const value = 'Foo bar bazzzz';

    expect(fetch).not.toHaveBeenCalled();

    rerender(withAppContext(<AutoSuggest {...props} value={value} />));

    await findByTestId('autoSuggest');

    expect(input.value).toEqual(value);

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should render a list of suggestions', async () => {
    const { container, queryByTestId, findByTestId } = render(withAppContext(<AutoSuggest {...props} />));
    const input = container.querySelector('input');

    input.focus();

    expect(queryByTestId('suggestList')).not.toBeInTheDocument();

    act(() => {
      fireEvent.change(input, { target: { value: 'Amsterdam' } });
    });

    const suggestList = await findByTestId('suggestList');

    expect(suggestList).toBeInTheDocument();
    expect(suggestList.getAttribute('role')).toEqual('listbox');
  });

  describe('keyboard navigation', () => {
    test('ArrowUp key', async () => {
      const { container, findByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');

      input.focus();

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowUp', code: 38, keyCode: 38 });
      });

      expect(document.activeElement).toEqual(input);

      act(() => {
        fireEvent.change(input, { target: { value: 'Diemen' } });
      });

      const suggestList = await findByTestId('suggestList');
      const listItems = [...suggestList.querySelectorAll('li')].reverse();

      formatResponse(JSONResponse)
        .reverse()
        .forEach((item, index) => {
          act(() => {
            fireEvent.keyDown(input, { key: 'ArrowUp', code: 38, keyCode: 38 });
          });

          const activeElement = listItems[index];

          expect(input.getAttribute('aria-activedescendant')).toEqual(item.id);
          expect(document.activeElement).toEqual(activeElement);
        });
    });

    test('ArrowDown key', async () => {
      const { container, findByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');

      input.focus();

      expect(input.getAttribute('aria-activedescendant')).toBeNull();

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      expect(document.activeElement).toEqual(input);

      act(() => {
        fireEvent.change(input, { target: { value: 'Weesp' } });
      });

      const suggestList = await findByTestId('suggestList');

      formatResponse(JSONResponse).forEach((item, index) => {
        act(() => {
          fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
        });

        const activeElement = suggestList.querySelector(`li:nth-of-type(${index + 1}`);

        expect(input.getAttribute('aria-activedescendant')).toEqual(item.id);
        expect(document.activeElement).toEqual(activeElement);
      });
    });

    test('ArrowUp and ArrowDown cycle', async () => {
      const { container, findByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');

      input.focus();

      expect(input.getAttribute('aria-activedescendant')).toBeNull();

      act(() => {
        fireEvent.change(input, { target: { value: 'Weesp' } });
      });

      const suggestList = await findByTestId('suggestList');

      act(() => {
        fireEvent.keyDown(input, { key: 'Down', code: 40, keyCode: 40 });
      });

      const firstElement = suggestList.querySelector('li:nth-of-type(1)');
      expect(document.activeElement).toEqual(firstElement);
      expect(input.getAttribute('aria-activedescendant')).toEqual(firstElement.id);

      act(() => {
        fireEvent.keyDown(input, { key: 'Up', code: 38, keyCode: 38 });
      });

      const lastElement = suggestList.querySelector('li:last-of-type');
      expect(document.activeElement).toEqual(lastElement);
      expect(input.getAttribute('aria-activedescendant')).toEqual(lastElement.id);

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      expect(input.getAttribute('aria-activedescendant')).toEqual(firstElement.id);
      expect(document.activeElement).toEqual(firstElement);
    });

    test('Esc', async () => {
      const onClear = jest.fn();
      const { container, findByTestId, queryByTestId } = render(
        withAppContext(<AutoSuggest {...props} onClear={onClear} />)
      );
      const input = container.querySelector('input');

      input.focus();

      act(() => {
        fireEvent.change(input, { target: { value: 'Boom' } });
      });

      const suggestList = await findByTestId('suggestList');
      const firstElement = suggestList.querySelector('li:nth-of-type(1)');

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      expect(document.activeElement).toEqual(firstElement);
      expect(onClear).not.toHaveBeenCalled();

      act(() => {
        fireEvent.keyDown(input, { key: 'Escape', code: 13, keyCode: 13 });
      });

      expect(onClear).toHaveBeenCalled();
      expect(input.value).toEqual('');
      expect(document.activeElement).toEqual(input);
      expect(queryByTestId('suggestList')).not.toBeInTheDocument();

      act(() => {
        fireEvent.change(input, { target: { value: 'Boomsloot' } });
      });

      await findByTestId('suggestList');

      act(() => {
        fireEvent.keyDown(input, { key: 'Esc', code: 13, keyCode: 13 });
      });

      expect(input.value).toEqual('');
      expect(document.activeElement).toEqual(input);
      expect(queryByTestId('suggestList')).not.toBeInTheDocument();
    });

    test('Home', async () => {
      const { container, findByTestId, getByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');

      input.focus();

      act(() => {
        fireEvent.change(input, { target: { value: 'Niezel' } });
      });

      const suggestList = await findByTestId('suggestList');

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      expect(document.activeElement).not.toEqual(input);

      act(() => {
        fireEvent.keyDown(input, { key: 'Home', code: 36, keyCode: 36 });
      });

      expect(document.activeElement).toEqual(input);
      expect(document.activeElement.selectionStart).toEqual(0);
      expect(getByTestId('suggestList')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      const firstElement = suggestList.querySelector('li:nth-of-type(1)');
      expect(document.activeElement).toEqual(firstElement);
    });

    test('End', async () => {
      const { container, findByTestId, getByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');
      const value = 'Midden';

      input.focus();

      act(() => {
        fireEvent.change(input, { target: { value } });
      });

      const suggestList = await findByTestId('suggestList');

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      expect(document.activeElement).not.toEqual(input);

      act(() => {
        fireEvent.keyDown(input, { key: 'End', code: 35, keyCode: 35 });
      });

      expect(document.activeElement).toEqual(input);
      expect(document.activeElement.selectionStart).toEqual(value.length);
      expect(getByTestId('suggestList')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      const firstElement = suggestList.querySelector('li:nth-of-type(1)');
      expect(document.activeElement).toEqual(firstElement);
    });

    test('Tab', async () => {
      const { container, findByTestId } = render(
        withAppContext(
          <Fragment>
            <AutoSuggest {...props} />
            <input type="text" name="foo" />
          </Fragment>
        )
      );
      const input = container.querySelector('input[aria-autocomplete=list]');
      const nameField = container.querySelector('input[name=foo]');

      input.focus();

      act(() => {
        fireEvent.change(input, { target: { value: 'Niezel' } });
      });

      const suggestList = await findByTestId('suggestList');

      expect(document.activeElement).toEqual(input);

      act(() => {
        fireEvent.focusOut(input, { relatedTarget: suggestList });
      });

      expect(suggestList).toBeInTheDocument();

      act(() => {
        fireEvent.focusOut(input, { relatedTarget: nameField });
      });

      expect(suggestList).not.toBeInTheDocument();
    });

    test('Enter', async () => {
      const mockedOnSubmit = jest.fn();
      const { container } = render(
        withAppContext(
          <form onSubmit={mockedOnSubmit}>
            <AutoSuggest {...props} />
            <input type="text" name="foo" />
          </form>
        )
      );

      const input = container.querySelector('input[aria-autocomplete=list]');
      input.focus();

      fireEvent.keyDown(input, { key: 'Enter', code: 13, keyCode: 13 });

      await screen.findByRole('combobox');
      expect(document.activeElement).toEqual(input);

      expect(screen.queryByTestId('suggestList')).not.toBeInTheDocument();
      expect(mockedOnSubmit).not.toHaveBeenCalled();
    });

    test('Any key (yes, such a key exists)', async () => {
      const { container, findByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');

      input.focus();

      act(() => {
        fireEvent.change(input, { target: { value: 'Meeuwenlaan' } });
      });

      await findByTestId('suggestList');

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      expect(document.activeElement).not.toEqual(input);

      act(() => {
        fireEvent.keyDown(input, { key: 'Space', code: 91, keyCode: 91 });
      });

      await findByTestId('suggestList');

      expect(document.activeElement).toEqual(input);
    });
  });

  it('should call onSelect on item click', async () => {
    const { container, findByTestId, queryByTestId } = render(withAppContext(<AutoSuggest {...props} />));
    const input = container.querySelector('input');

    act(() => {
      fireEvent.change(input, { target: { value: 'Rembrandt' } });
    });

    const suggestList = await findByTestId('suggestList');

    act(() => {
      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
    });

    expect(document.activeElement).not.toEqual(input);

    const firstElement = suggestList.querySelector('li:nth-of-type(1)');
    const firstOption = formatResponse(JSONResponse)[0];

    expect(onSelect).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(firstElement);
    });

    expect(document.activeElement).toEqual(input);
    expect(queryByTestId('suggestList')).not.toBeInTheDocument();
    expect(input.value).toEqual(firstOption.value);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(firstOption);
  });

  it('should call onClear', async () => {
    const onClear = jest.fn();
    const { container, findByTestId } = render(withAppContext(<AutoSuggest {...props} onClear={onClear} />));
    const input = container.querySelector('input');

    act(() => {
      fireEvent.change(input, { target: { value: 'Rembrandt' } });
    });

    await findByTestId('autoSuggest');

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY);
    });

    expect(onClear).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: '' } });
    });

    await findByTestId('autoSuggest');

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY);
    });

    expect(onClear).toHaveBeenCalled();
  });
});
