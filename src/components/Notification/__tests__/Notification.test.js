import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import 'jest-styled-components';

import { isAuthenticated } from 'shared/services/auth/auth';

import {
  ONCLOSE_TIMEOUT,
  SLIDEUP_TIMEOUT,
  TYPE_GLOBAL,
  VARIANT_ERROR,
  VARIANT_NOTICE,
  VARIANT_DEFAULT,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants';
import {
  SITE_HEADER_HEIGHT_SHORT,
  SITE_HEADER_HEIGHT_TALL,
} from 'containers/SiteHeader/constants';

import Notification, {
  BG_COLOR_ERROR,
  BG_COLOR_NOTICE,
  BG_COLOR_SUCCESS,
} from '..';

jest.useFakeTimers();

jest.mock('shared/services/auth/auth');

describe('components/Notification', () => {
  beforeEach(() => {
    global.setTimeout.mock.calls = [];
    global.clearTimeout.mock.calls = [];
  });

  it('renders correctly when not logged in', () => {
    isAuthenticated.mockImplementation(() => false);

    const title = 'Here be dragons';
    const message = 'hic sunt dracones';
    const { container, getByText } = render(
      withAppContext(<Notification title={title} message={message} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
    expect(container.firstChild).toHaveStyleRule(
      'top',
      `${SITE_HEADER_HEIGHT_TALL}px`
    );
    expect(container.firstChild).toHaveStyleRule('position', 'absolute');
    expect(container.firstChild).toHaveStyleRule(
      'transition',
      expect.stringContaining('ease-out')
    );
  });

  it('renders correctly when logged in', () => {
    isAuthenticated.mockImplementation(() => true);

    const { container } = render(
      withAppContext(<Notification title="Foo bar" />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'top',
      `${SITE_HEADER_HEIGHT_SHORT}px`
    );
    expect(container.firstChild).toHaveStyleRule('position', 'fixed');
  });

  it('renders its variants', () => {
    const { container, rerender } = render(
      withAppContext(<Notification title="Foo bar" />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_NOTICE
    );

    rerender(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_NOTICE} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_NOTICE
    );

    rerender(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_DEFAULT} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_NOTICE
    );

    rerender(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_ERROR} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_ERROR
    );

    rerender(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_SUCCESS} />)
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      BG_COLOR_SUCCESS
    );
  });

  it('uses timeouts to time navigation actions for VARIANT_NOTICE', () => {
    const onClose = jest.fn();

    render(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_NOTICE} onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT);
    });

    // onClose should only be called when the element completely disappears, so after both timeouts combined
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(SLIDEUP_TIMEOUT);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('uses timeouts to time navigation actions for VARIANT_SUCCESS', () => {
    const onClose = jest.fn();

    render(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_SUCCESS} onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(SLIDEUP_TIMEOUT);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('does not use timeouts to time navigation actions for VARIANT_ERROR', () => {
    const onClose = jest.fn();

    render(
      withAppContext(<Notification title="Foo bar" variant={VARIANT_ERROR} onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(SLIDEUP_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not use timeouts to time navigation actions for TYPE_GLOBAL', () => {
    const onClose = jest.fn();

    render(
      withAppContext(<Notification title="Foo bar" type={TYPE_GLOBAL} onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(SLIDEUP_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('hides the component after a specific amount of time and executes callback function', () => {
    const onClose = jest.fn();

    const { container } = render(
      withAppContext(<Notification title="Foo bar" onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    expect(container.firstChild.classList.contains('slideup')).toEqual(false);

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(SLIDEUP_TIMEOUT);
    });

    expect(onClose).toHaveBeenCalled();

    expect(container.firstChild.classList.contains('slideup')).toEqual(true);
  });

  it('clears timeouts on unmount', () => {
    const onClose = jest.fn();

    const { unmount } = render(
      withAppContext(<Notification title="Foo bar" onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      unmount();
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('clears the timer when the component receives a mouse enter event', () => {
    const onClose = jest.fn();

    const { getByTestId } = render(
      withAppContext(<Notification title="Foo bar" onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT / 2);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      fireEvent.mouseOver(getByTestId('notification'));
    });

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('restarts the timer when the component receives a mouse out event', () => {
    const onClose = jest.fn();

    const { getByTestId } = render(
      withAppContext(<Notification title="Foo bar" onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT / 2);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      fireEvent.mouseOver(getByTestId('notification'));
    });

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      fireEvent.mouseOut(getByTestId('notification'));
    });

    act(() => {
      jest.advanceTimersByTime(ONCLOSE_TIMEOUT + SLIDEUP_TIMEOUT);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides when the close button is clicked', () => {
    const onClose = jest.fn();

    const { container, getByTestId } = render(
      withAppContext(<Notification title="Foo bar" onClose={onClose} />)
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      fireEvent.mouseOver(getByTestId('notification'));
    });

    act(() => {
      fireEvent.click(getByTestId('notificationClose'));
    });

    expect(container.firstChild.classList.contains('slideup')).toEqual(true);

    expect(onClose).toHaveBeenCalledTimes(0);

    act(() => {
      jest.advanceTimersByTime(SLIDEUP_TIMEOUT);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
