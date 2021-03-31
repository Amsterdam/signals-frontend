// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks';
import * as reactRouterDom from 'react-router-dom';

import useLocationReferrer from '../useLocationReferrer';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
  }),
}));

describe('hooks/useLocationReferrer', () => {
  it('should return a location', async () => {
    const { result, rerender } = renderHook(() => useLocationReferrer());

    expect(result.current).toEqual({ pathname: '/' });

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({ pathname: '/foo-bar', referrer: '/' }));

    rerender();

    expect(result.current).toEqual({ pathname: '/foo-bar', referrer: '/' });
  });
});
