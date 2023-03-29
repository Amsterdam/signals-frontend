// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam

import { setupSchema } from './index'
import {
  falsyOrNumber,
  inPast,
  validatePhoneNumber,
} from '../custom-validators'

describe('Yup resolver takes a bunch of controls and returns it into a schema', () => {
  it('should return a schema', async () => {
    const controls = {
      source: {
        options: {
          validators: ['required'],
        },
      },
      locatie: {
        options: {
          validators: ['required'],
        },
      },
      email: {
        options: {
          validators: ['email'],
        },
      },
      maxlen2: {
        options: {
          validators: ['required', ['maxLength', 1]],
        },
      },
      phoneNumber: {
        options: {
          validators: [validatePhoneNumber],
        },
      },
      falsyOrNumberQuestion: {
        options: {
          validators: [falsyOrNumber],
        },
      },
      inPastQuestion: {
        options: {
          validators: [inPast],
        },
      },
      nestedObjectQuestion: {
        options: {
          validators: ['required'],
        },
      },
      array: {
        options: {
          validators: ['required'],
        },
      },
    }

    const schema = setupSchema(controls)
    await expect(
      schema.validateAt('source', { source: 'online' })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('locatie', {
        locatie: { location: { coordinates: undefined } },
      })
    ).rejects.toBeTruthy()
    await expect(
      schema.validateAt('locatie', {
        locatie: { location: { coordinates: 'blackrosemarchesa' } },
      })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('email', { email: 'blackrosemarchesa' })
    ).rejects.toBeTruthy()
    await expect(
      schema.validateAt('email', { email: 'blackrosemarchesa@mail.com' })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('maxlen2', { maxlen2: 'b' })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('phoneNumber', { phoneNumber: 'armageddon' })
    ).rejects.toBeTruthy()
    await expect(
      schema.validateAt('phoneNumber', { phoneNumber: 1 })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('falsyOrNumberQuestion', {
        falsyOrNumberQuestion: 'invalid type',
      })
    ).rejects.toBeTruthy()
    await expect(
      schema.validateAt('falsyOrNumberQuestion', { falsyOrNumberQuestion: 1 })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('inPastQuestion', {
        inPastQuestion: '1000000000000000000000000000000', //30 zero's to be sure it's in the future
      })
    ).rejects.toBeTruthy()
    await expect(
      schema.validateAt('inPastQuestion', { inPastQuestion: 100 })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('nestedObjectQuestion', { nestedObjectQuestion: {} })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('array', { array: ['preordain'] })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('source', {
        source: { id: 'winota', label: 'the winner' },
      })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('source', { source: { id: '', label: '' } })
    ).rejects.toBeTruthy()
    await expect(schema.validateAt('array', { array: [] })).rejects.toBeTruthy()
  })
})
