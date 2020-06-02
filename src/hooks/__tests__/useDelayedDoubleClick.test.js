import { renderHook, act } from '@testing-library/react-hooks';

import { resolveAfterMs } from 'test/utils';

import useDelayedDoubleClick, { DOUBLE_CLICK_TIMEOUT } from '../useDelayedDoubleClick';

describe('hooks/useDelayedDoubleClick', () => {
  it('should execute clickFunc', async () => {
    const clickFunc = jest.fn();

    const { result } = renderHook(() => useDelayedDoubleClick(clickFunc));

    const event = { preventDefault: jest.fn() };

    act(() => {
      result.current.click(event);
    });

    expect(clickFunc).not.toHaveBeenCalled();

    await resolveAfterMs(DOUBLE_CLICK_TIMEOUT);

    expect(clickFunc).toHaveBeenCalledWith(event);
  });

  it('should not execute clickFunc when double clicking', async () => {
    const clickFunc = jest.fn();

    const { result } = renderHook(() => useDelayedDoubleClick(clickFunc));

    const event = { preventDefault: jest.fn() };

    act(() => {
      result.current.click(event);
    });

    expect(clickFunc).not.toHaveBeenCalled();

    act(() => {
      result.current.doubleClick();
    });

    await resolveAfterMs(DOUBLE_CLICK_TIMEOUT);

    expect(clickFunc).not.toHaveBeenCalled();

    act(() => {
      result.current.click(event);
    });

    expect(clickFunc).not.toHaveBeenCalled();

    await resolveAfterMs(DOUBLE_CLICK_TIMEOUT);

    act(() => {
      result.current.click(event);
    });

    expect(clickFunc).toHaveBeenCalledWith(event);
  });
});
