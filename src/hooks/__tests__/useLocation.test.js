import { renderHook } from '@testing-library/react-hooks';
import * as reactRouterDom from 'react-router-dom';

import useLocation from '../useLocation';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    hash: '',
    key: '',
    pathname: '/',
    search: '',
    state: null,
  }),
}));

describe('hooks/useLocation', () => {
  it('return the location result from the react-router-dom hook', () => {
    const { result } = renderHook(() => useLocation());
    const { result: reactRouterDomResult } = renderHook(() => reactRouterDom.useLocation());

    expect(result.current.location).toEqual(reactRouterDomResult.current);
  });

  it('should return isFrontOffice', () => {
    const { result } = renderHook(() => useLocation());

    expect(result.current.isFrontOffice).toEqual(true);

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: '/manage',
      search: '',
      state: null,
    }));

    const { result: result2 } = renderHook(() => useLocation());

    expect(result2.current.isFrontOffice).toEqual(false);

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: '/instellingen',
      search: '',
      state: null,
    }));

    const { result: result3 } = renderHook(() => useLocation());

    expect(result3.current.isFrontOffice).toEqual(false);
  });
});
