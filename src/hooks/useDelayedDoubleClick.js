import { useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';

/**
 * Timeout by which clicks on the map are delayed so that potential double click can be captured
 * Increasing the value lead to a perceivable delay between click and the placement of the marker. Decreasing the value
 * could lead to a double click never being captured, because of the limited time to have both click registered.
 */
export const DOUBLE_CLICK_TIMEOUT = 200;

const useDelayedDoubleClick = clickFunc => {
  const doubleClicking = useRef(false);

  /**
   * Capture doubleClick event
   *
   * Will prevent click events from being fired until the timeout has expired
   */
  const doubleClick = useCallback(() => {
    doubleClicking.current = true;

    const dblClickTimeout = setTimeout(() => {
      doubleClicking.current = false;
      clearTimeout(dblClickTimeout);
    }, DOUBLE_CLICK_TIMEOUT * 2);
  }, []);

  const debouncedClick = useCallback(
    event => {
      if (doubleClicking.current) return;

      clickFunc(event);
    },
    [clickFunc]
  );

  const click = useCallback(debounce(debouncedClick, DOUBLE_CLICK_TIMEOUT), [debouncedClick]);

  return {
    doubleClick,
    click,
  };
};

export default useDelayedDoubleClick;
