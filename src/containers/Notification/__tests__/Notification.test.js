// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import { mount } from 'enzyme'
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import { TYPE_GLOBAL, VARIANT_NOTICE } from '../constants'

import NotificationContainer, { NotificationContainerComponent } from '..'

describe('containers/Notification', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<NotificationContainer />))

    const props = tree.find(NotificationContainerComponent).props()

    expect(props.notification).toBeDefined()
  })

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<NotificationContainer />))

    const containerProps = tree.find(NotificationContainerComponent).props()

    expect(containerProps.onResetNotification).not.toBeUndefined()
    expect(typeof containerProps.onResetNotification).toEqual('function')
  })

  it('should render the Notification component', () => {
    const notification = {
      title: 'Foo bar',
      message: 'hic sunt dracones',
      type: TYPE_GLOBAL,
      variant: VARIANT_NOTICE,
    }

    const { container } = render(
      withAppContext(
        <NotificationContainerComponent
          notification={notification}
          onResetNotification={() => {}}
        />
      )
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should NOT render the Notification component', () => {
    const notification = {
      title: '',
      message: 'hic sunt dracones',
      type: TYPE_GLOBAL,
      variant: VARIANT_NOTICE,
    }

    const { container } = render(
      withAppContext(
        <NotificationContainerComponent
          notification={notification}
          onResetNotification={() => {}}
        />
      )
    )

    expect(container.firstChild).not.toBeInTheDocument()
  })
})
