import React, { Fragment } from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import AutoSuggest, { INPUT_DELAY } from '..';
import JSONResponse from './mockResponse.json';

const mockResponse = JSON.stringify(JSONResponse);
fetch.mockResponse(mockResponse);

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

const resolveAfterMs = timeMs => new Promise(resolve => setTimeout(resolve, timeMs));

describe('src/components/AutoSuggest', () => {
  beforeEach(() => {
    onSelect.mockReset();
  });

  it('should render a combobox with input field', () => {
    const { container } = render(withAppContext(<AutoSuggest {...props} />));

    expect(container.querySelector('[role=combobox]')).toBeInTheDocument();

    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('aria-autocomplete')).toEqual('list');
  });

  it('should request external service', async () => {
    const { container } = render(withAppContext(<AutoSuggest {...props} />));
    const input = container.querySelector('input');

    act(() => {
      fireEvent.change(input, { target: { value: 'A' } });
    });

    await wait(() => resolveAfterMs(INPUT_DELAY));

    expect(fetch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: 'Am' } });
    });

    await wait(() => resolveAfterMs(INPUT_DELAY));

    expect(fetch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: 'Ams' } });
    });

    expect(fetch).not.toHaveBeenCalled();

    await wait(() => resolveAfterMs(INPUT_DELAY));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${url}Ams`, expect.anything());
  });

  it('should render a list of suggestions', async () => {
    const { container, queryByTestId, findByTestId } = render(withAppContext(<AutoSuggest {...props} />));
    const input = container.querySelector('input');

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

    test('Enter', async () => {
      const { container, findByTestId, queryByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');

      act(() => {
        fireEvent.change(input, { target: { value: 'Limburg' } });
      });

      const suggestList = await findByTestId('suggestList');
      const firstElement = suggestList.querySelector('li:nth-of-type(1)');

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      expect(document.activeElement).toEqual(firstElement);

      act(() => {
        // return in input field should not do anything when the pulldown is open
        fireEvent.keyDown(input, { key: 'Enter', code: 13, keyCode: 13 });
      });

      await findByTestId('suggestList');

      expect(input.value).toEqual('Limburg');

      act(() => {
        fireEvent.keyDown(firstElement, { key: 'Enter', code: 13, keyCode: 13 });
      });

      expect(document.activeElement).toEqual(input);
      expect(input.value).toEqual(formatResponse(JSONResponse)[0].value);
      expect(queryByTestId('suggestList')).not.toBeInTheDocument();
    });

    test('Esc', async () => {
      const { container, findByTestId, queryByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');

      act(() => {
        fireEvent.change(input, { target: { value: 'Boom' } });
      });

      const suggestList = await findByTestId('suggestList');
      const firstElement = suggestList.querySelector('li:nth-of-type(1)');

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 });
      });

      expect(document.activeElement).toEqual(firstElement);

      act(() => {
        fireEvent.keyDown(input, { key: 'Escape', code: 13, keyCode: 13 });
      });

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

    test('Any key (yes, such a key exists)', async() => {
      const { container, findByTestId } = render(withAppContext(<AutoSuggest {...props} />));
      const input = container.querySelector('input');

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
});
