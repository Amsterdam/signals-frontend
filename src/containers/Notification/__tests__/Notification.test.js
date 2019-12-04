import React from 'react';
import { mount } from 'enzyme';
import { render, act } from '@testing-library/react';
import { history, withAppContext } from 'test/utils';

import { TYPE_LOCAL, TYPE_GLOBAL, VARIANT_DEFAULT } from '../constants';
import NotificationContainer, { NotificationContainerComponent } from '..';

describe('containers/Notification', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<NotificationContainer />));

    const props = tree.find(NotificationContainerComponent).props();

    expect(props.notification).toBeDefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<NotificationContainer />));

    const containerProps = tree.find(NotificationContainerComponent).props();

    expect(containerProps.onResetNotification).not.toBeUndefined();
    expect(typeof containerProps.onResetNotification).toEqual('function');
  });

  it('should NOT reset notification on history change', () => {
    const onResetNotification = jest.fn();

    const notification = {
      title: 'Foo bar',
      message: 'hic sunt dracones',
      type: TYPE_GLOBAL,
      variant: VARIANT_DEFAULT,
    };

    render(
      withAppContext(
        <NotificationContainerComponent
          onResetNotification={onResetNotification}
          notification={notification}
        />
      )
    );

    act(() => {
      history.push('/');
    });

    expect(onResetNotification).not.toHaveBeenCalled();
  });

  it('should reset notification on history change', () => {
    const onResetNotification = jest.fn();

    const notification = {
      title: 'Foo bar',
      message: 'hic sunt dracones',
      type: TYPE_LOCAL,
      variant: VARIANT_DEFAULT,
    };

    render(
      withAppContext(
        <NotificationContainerComponent
          onResetNotification={onResetNotification}
          notification={notification}
        />
      )
    );

    expect(onResetNotification).not.toHaveBeenCalled();

    act(() => {
      history.push('/manage');
    });

    expect(onResetNotification).toHaveBeenCalled();
  });

  it('should not reset notification on unmount', () => {
    const onResetNotification = jest.fn();

    const notification = {
      title: 'Foo bar',
      message: 'hic sunt dracones',
      type: TYPE_LOCAL,
      variant: VARIANT_DEFAULT,
    };

    const { unmount } = render(
      withAppContext(
        <NotificationContainerComponent
          onResetNotification={onResetNotification}
          notification={notification}
        />
      )
    );

    expect(onResetNotification).not.toHaveBeenCalled();

    act(() => {
      unmount();
    });

    expect(onResetNotification).toHaveBeenCalled();
  });
});
