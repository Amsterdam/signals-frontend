// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { clearBlockingAlert } from './clear-blocking-alert'

describe('clearBlockingAlert', () => {
  it('should trigger validation when isBlocking validator is present', () => {
    const controls1a = {
      prefix1_q1: {
        meta: {
          name: 'prefix1_q1',
        },
        options: {
          validators: ['isBlocking'],
        },
      },
    }

    const controls1b = {
      prefix1: {
        meta: {
          name: 'prefix1',
        },
      },
    }

    const controls2 = {
      prefix2: {
        meta: {
          name: 'prefix2',
        },
      },
    }

    const clearErrors = jest.fn()
    ;[
      controls1a,
      controls1b,
      controls2,
      controls1a,
      controls1a,
      controls1b,
    ].forEach((controls: any) => {
      clearBlockingAlert(controls, clearErrors)
    })
    expect(clearErrors).toHaveBeenCalledWith('prefix1_q1')
    expect(clearErrors).not.toHaveBeenCalledWith('prefix1_q2')
    expect(clearErrors).toHaveBeenCalledTimes(2)
  })
})
