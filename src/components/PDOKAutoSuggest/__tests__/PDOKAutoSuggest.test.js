import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import JSONResponse from 'utils/__tests__/fixtures/PDOKResponseData.json';
import { INPUT_DELAY } from 'components/AutoSuggest';
import { formatPDOKResponse } from 'shared/services/map-location';
import PDOKAutoSuggest, { formatResponseFunc } from '..';

const mockResponse = JSON.stringify(JSONResponse);

const onSelect = jest.fn();
const resolveAfterMs = timeMs => new Promise(resolve => setTimeout(resolve, timeMs));
const municipalityQs = 'fq=gemeentenaam:';
const fieldListQs = 'fl=';
const defaultFieldsQs = 'id,weergavenaam';

const renderAndSearch = async (value = 'Dam', props = {}) => {
  const result = render(withAppContext(<PDOKAutoSuggest onSelect={onSelect} {...props} />));
  const input = result.container.querySelector('input[aria-autocomplete]');

  input.focus();

  act(() => {
    fireEvent.change(input, { target: { value } });
  });

  await waitFor(() => resolveAfterMs(INPUT_DELAY));

  return result;
};

describe('components/PDOKAutoSuggest', () => {
  beforeEach(() => {
    fetch.mockResponse(mockResponse);
  });

  afterEach(() => {
    fetch.mockReset();
    onSelect.mockReset();
  });

  it('should render an AutoSuggest', () => {
    const { getByTestId } = render(withAppContext(<PDOKAutoSuggest onSelect={onSelect} />));

    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  describe('fetch', () => {
    it('should not be called on focus', () => {
      const result = render(withAppContext(<PDOKAutoSuggest onSelect={onSelect} />));
      const input = result.container.querySelector('input[aria-autocomplete]');

      input.focus();

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should be called on change', async () => {
      await renderAndSearch();
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('municipality', () => {
    it('should call fetch without municipality by default', async () => {
      await renderAndSearch();
      expect(fetch).toHaveBeenCalledWith(expect.not.stringContaining(municipalityQs), expect.anything());
    });

    it('should call fetch with municipality', async () => {
      await renderAndSearch('Dam', { municipality: 'amsterdam' });
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`${municipalityQs}"amsterdam"`), expect.anything());
    });

    it('should work with an array for municipality', async () => {
      await renderAndSearch('Dam', { municipality: ['utrecht', 'amsterdam'] });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${municipalityQs}"utrecht" "amsterdam"`),
        expect.anything()
      );
    });
  });

  describe('fieldList', () => {
    it('should call fetch with default field list', async () => {
      await renderAndSearch();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${fieldListQs}${defaultFieldsQs}`),
        expect.anything()
      );
    });

    it('should call fetch with extra fields', async () => {
      await renderAndSearch('Dam', { fieldList: ['name', 'type'] });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${fieldListQs}name,type,${defaultFieldsQs}`),
        expect.anything()
      );
    });
  });

  describe('onSelect', () => {
    it('should be called with default format function', async () => {
      const { findByTestId } = await renderAndSearch();
      const suggestList = await findByTestId('suggestList');
      const firstElement = suggestList.querySelector('li:nth-of-type(1)');

      expect(onSelect).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(firstElement);
      });

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(formatResponseFunc(JSONResponse)[0]);
    });

    it('should be called with custom format function', async () => {
      const { findByTestId } = await renderAndSearch('Dam', { formatResponse: formatPDOKResponse });
      const suggestList = await findByTestId('suggestList');
      const firstElement = suggestList.querySelector('li:nth-of-type(1)');

      expect(onSelect).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(firstElement);
      });

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(formatPDOKResponse(JSONResponse)[0]);
    });
  });

  it('should pass on props to underlying component', () => {
    const placeholder = 'Foo bar';
    const { container } = render(withAppContext(<PDOKAutoSuggest onSelect={onSelect} placeholder={placeholder} />));

    expect(container.querySelector(`[placeholder="${placeholder}"]`)).toBeInTheDocument();
  });
});
