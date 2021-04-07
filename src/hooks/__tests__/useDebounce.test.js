// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks';

import useDebounce from '../useDebounce';

describe('hooks/useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls function parameter', () => {
    const callable = jest.fn();
    const { result } = renderHook(() => useDebounce(callable, 200));

    result.current();

    expect(callable).not.toHaveBeenCalled();

    jest.advanceTimersByTime(199);

    expect(callable).not.toHaveBeenCalled();

    // calling again, should reset timer
    result.current();

    expect(callable).not.toHaveBeenCalled();

    jest.advanceTimersByTime(199);

    expect(callable).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    expect(callable).toHaveBeenCalled();
  });
});
