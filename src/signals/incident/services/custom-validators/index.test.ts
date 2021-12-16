// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { AbstractControl } from 'react-reactive-form'
import { validatePhoneNumber, createRequired, validateObjectLocation } from '.'

describe('The custom validators service', () => {
  describe('validatePhoneNumber', () => {
    const error =
      'Ongeldig telefoonnummer, alleen cijfers, spaties, haakjes, + en - zijn toegestaan.'

    it('with correct telephone number', () => {
      const control = {
        value: '+31 (20) 6793-793',
      } as AbstractControl

      expect(validatePhoneNumber(control)).toEqual(null)
    })

    it('with undefined telephone number', () => {
      const control = {
        value: undefined,
      } as AbstractControl

      expect(validatePhoneNumber(control)).toEqual(null)
    })

    it('with incorrect telephone number with letter', () => {
      const control = {
        value: '+3120-6a',
      } as AbstractControl

      expect(validatePhoneNumber(control)).toEqual({
        custom: error,
      })
    })

    it('with incorrect telephone number with incorrect chars', () => {
      const control = {
        value: '+3120-6 *&',
      } as AbstractControl

      expect(validatePhoneNumber(control)).toEqual({
        custom: error,
      })
    })

    it('with empty value', () => {
      expect(validatePhoneNumber()).toEqual(null)
    })
  })

  describe('createRequired', () => {
    const error = 'Veplicht'

    it('returns error if value is incorrect', () => {
      let input = {
        value: null,
      } as AbstractControl

      expect(createRequired(error)(input)).toEqual({ required: error })

      input = {} as AbstractControl
      expect(createRequired(error)(input)).toEqual({ required: error })

      input = {
        value: '',
      } as AbstractControl
      expect(createRequired(error)(input)).toEqual({ required: error })
    })

    it('returns null if value is correct', () => {
      const input = {
        value: 'valid',
      } as AbstractControl

      expect(createRequired(error)(input)).toEqual(null)
    })
  })

  describe('validateObjectLocation', () => {
    it('returns a function', () => {
      expect(validateObjectLocation('foo')).toBeInstanceOf(Function)
    })

    it('returns null when valid', () => {
      const validationFunc = validateObjectLocation('zork')

      expect(validationFunc({ value: 'foobar' } as AbstractControl)).toBeNull()
    })

    it('returns a custom error message when invalid', () => {
      const objectType = 'container'
      const validationFunc = validateObjectLocation(objectType)

      expect(validationFunc({ value: '' } as AbstractControl)).toStrictEqual({
        custom: `Kies een locatie of een ${objectType} op de kaart of vul een adres in`,
      })
    })
  })
})
