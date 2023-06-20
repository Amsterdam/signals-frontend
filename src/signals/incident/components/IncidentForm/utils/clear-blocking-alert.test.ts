// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { clearBlockingAlert } from './clear-blocking-alert'

describe('clearBlockingAlert', () => {
  it('should trigger validation when isBlockingAnswer validator is present', () => {
    const controls1 = {
      name: {
        meta: {
          name: 'name',
        },
        options: {
          validators: ['isBlockingAnswer'],
        },
      },
    }

    const controls2 = {
      name: {
        meta: {
          name: 'name',
        },
      },
    }

    const clearErrors = jest.fn()
    ;[controls1, controls2].forEach((controls: any) => {
      clearBlockingAlert(controls, clearErrors)
    })
    expect(clearErrors).toHaveBeenCalledWith('name')
  })
})
