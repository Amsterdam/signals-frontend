// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { validateIsBlocking } from './validate-is-blocking'

describe('validateIsBlocking', () => {
  it('should trigger validation when isBlockingAnswer validator is present', () => {
    const controls = {
      name: {
        meta: {
          validators: ['isBlockingAnswer'],
        },
      },
    }
    const trigger = jest.fn()
    validateIsBlocking(controls, 'name', trigger)
    expect(trigger).toHaveBeenCalledWith('name')

    const controls2 = {
      name: {
        meta: {
          validators: [],
        },
      },
    }

    trigger.mockClear()

    validateIsBlocking(controls2, 'name', trigger)
    expect(trigger).not.toHaveBeenCalledWith('name')
  })
})
