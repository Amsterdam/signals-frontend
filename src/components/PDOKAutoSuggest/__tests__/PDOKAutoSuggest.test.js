import React from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import JSONResponse from 'utils/__tests__/fixtures/PDOKResponseData.json';
import { INPUT_DELAY } from 'components/AutoSuggest';
import { formatPDOKResponse } from 'shared/services/map-location';
import PDOKAutoSuggest, { formatResponseFunc } from '..';

const mockResponse = JSON.stringify(JSONResponse);
fetch.mockResponse(mockResponse);

const onSelect = jest.fn();
const resolveAfterMs = timeMs => new Promise(resolve => setTimeout(resolve, timeMs));

describe('components/PDOKAutoSuggest', () => {
  beforeEach(() => {
    onSelect.mockReset();
  });

  it('should render an AutoSuggest', () => {
    const { getByTestId } = render(withAppContext(<PDOKAutoSuggest onSelect={onSelect} />));

    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it('should call fetch with the gemeentenaam', async () => {
    const { container, rerender } = render(withAppContext(<PDOKAutoSuggest onSelect={onSelect} />));
    const input = container.querySelector('input[aria-autocomplete]');

    input.focus();

    expect(fetch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: 'Amsterdam' } });
    });

    await wait(() => resolveAfterMs(INPUT_DELAY));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('fq=gemeentenaam:amsterdam'), expect.anything());

    rerender(withAppContext(<PDOKAutoSuggest onSelect={onSelect} gemeentenaam="(amsterdam OR weesp)" />));

    act(() => {
      fireEvent.change(input, { target: { value: 'Westerp' } });
    });

    await wait(() => resolveAfterMs(INPUT_DELAY));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('fq=gemeentenaam:(amsterdam OR weesp)'),
      expect.anything()
    );
  });

  it('should call onSelect', async () => {
    const { container, findByTestId, rerender } = render(withAppContext(<PDOKAutoSuggest onSelect={onSelect} />));
    const input = container.querySelector('input[aria-autocomplete]');

    input.focus();

    act(() => {
      fireEvent.change(input, { target: { value: 'Amsterdam' } });
    });

    const suggestList = await findByTestId('suggestList');
    const firstElement = suggestList.querySelector('li:nth-of-type(1)');

    expect(onSelect).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(firstElement);
    });

    expect(onSelect).toHaveBeenCalledWith(formatResponseFunc(JSONResponse)[0]);

    rerender(withAppContext(<PDOKAutoSuggest onSelect={onSelect} formatResponse={formatPDOKResponse} />));

    input.focus();

    act(() => {
      fireEvent.change(input, { target: { value: 'Amsterdam' } });
    });

    const suggestL = await findByTestId('suggestList');
    const firstElem = suggestL.querySelector('li:nth-of-type(1)');

    expect(onSelect).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(firstElem);
    });

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith(formatPDOKResponse(JSONResponse)[0]);
  });

  it('should pass on props to underlying component', () => {
    const placeholder = 'Foo bar';
    const { container } = render(withAppContext(<PDOKAutoSuggest onSelect={onSelect} placeholder={placeholder} />));

    expect(container.querySelector(`[placeholder="${placeholder}"]`)).toBeInTheDocument();
  });
});
