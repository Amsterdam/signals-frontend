// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { AbstractControl } from 'react-reactive-form'

import { validatePhoneNumber, validateObjectLocation, falsyOrNumber } from '.'

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

  describe('validateObjectLocation', () => {
    it('returns a function', () => {
      expect(validateObjectLocation('foo')).toBeInstanceOf(Function)
    })

    it('returns null when valid', () => {
      const validationFunc = validateObjectLocation('zork')
      const value = {
        location: {
          coordinates: {
            lat: 52.3731081,
            lng: 4.8932945,
          },
        },
      }

      expect(validationFunc({ value } as AbstractControl)).toBeNull()
    })

    it('returns a custom error message when invalid', () => {
      const objectType = 'container'
      const validationFunc = validateObjectLocation(objectType)

      expect(validationFunc({ value: '' } as AbstractControl)).toStrictEqual({
        custom: `Kies een locatie of een ${objectType} op de kaart of vul een adres in`,
      })
    })
  })

  describe('falsyOrNumber', () => {
    it('returns a function', () => {
      expect(falsyOrNumber).toBeInstanceOf(Function)
    })

    it('evaluates null values', () => {
      const inputNull = {
        value: null,
      } as AbstractControl

      const inputUndefined = {
        value: undefined,
      } as AbstractControl

      const inputNumber = {
        value: 1234567890,
      } as AbstractControl

      const invalidInputNumber = {
        value: 'ajksdlfjlk',
      } as AbstractControl

      expect(falsyOrNumber(inputNull)).toBeNull()
      expect(falsyOrNumber(inputNumber)).toBeNull()
      expect(falsyOrNumber(inputUndefined)).toBeNull()
      expect(falsyOrNumber(invalidInputNumber)).not.toBeNull()
    })
  })
})
