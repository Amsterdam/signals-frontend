// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam

import { setUpSchema } from './index'

describe('Yup resolver takes a bunch of controls and returns it into a schema', () => {
  it('should return a schema', async () => {
    const controls = {
      source: {
        options: {
          validators: ['required'],
        },
      },
      phone: {
        options: {
          validators: ['required'],
        },
      },
      phone2: {
        options: {
          validators: [],
        },
      },
      location: {
        options: {
          validators: [],
        },
      },
      email: {
        options: {
          validators: ['email'],
        },
      },
      maxlen1: {
        options: {
          validators: ['required', '1'],
        },
      },
      maxlen2: {
        options: {
          validators: ['required', ['maxLength', 1]],
        },
      },
      validatewithfunction: {
        options: {
          validators: [() => ({ custom: 'bad' })],
        },
      },
    }

    const schema = setUpSchema(controls)
    await expect(
      schema.validateAt('source', { source: 'online' })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('phone', { phone: '123' })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('location', { location: '' })
    ).rejects.toBeTruthy()
    await expect(
      schema.validateAt('location', { location: {} })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('email', { email: 'blackrosemarchesa' })
    ).rejects.toBeTruthy()
    await expect(
      schema.validateAt('email', { email: 'blackrosemarchesa@mail.com' })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('maxlen1', { maxlen1: 'aa' })
    ).rejects.toBeTruthy()
    await expect(
      schema.validateAt('maxlen2', { maxlen2: 'b' })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('maxlen2', { maxlen2: 'b' })
    ).resolves.toBeTruthy()
    await expect(
      schema.validateAt('validatewithfunction', { validatewithfunction: 'b' })
    ).rejects.toBeTruthy()
  })
})
