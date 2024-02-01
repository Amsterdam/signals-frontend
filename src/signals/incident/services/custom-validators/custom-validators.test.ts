// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import {
  falsyOrNumber,
  inPast,
  nullOrNumber,
  validateObjectLocation,
  validatePhoneNumber,
} from '.'

describe('The custom validators service', () => {
  describe('validatePhoneNumber', () => {
    const error =
      'Ongeldig telefoonnummer, alleen cijfers, spaties, haakjes, + en - zijn toegestaan.'

    it('with correct telephone number', () => {
      const control = {
        value: '+31 (20) 6793-793',
      }
      expect(validatePhoneNumber(control)).toEqual(null)
    })

    it('with undefined telephone number', () => {
      const control = {
        value: undefined,
      }
      expect(validatePhoneNumber(control)).toEqual(null)
    })

    it('with incorrect telephone number with letter', () => {
      const control = {
        value: '+3120-6a',
      }
      expect(validatePhoneNumber(control)).toEqual({
        custom: error,
      })
    })

    it('with incorrect telephone number with incorrect chars', () => {
      const control = {
        value: '+3120-6 *&',
      }
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

      expect(validationFunc({ value })).toBeNull()
    })

    it('returns a custom error message when invalid', () => {
      const objectType = 'container'
      const validationFunc = validateObjectLocation(objectType)

      expect(validationFunc({ value: '' })).toStrictEqual({
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
      }
      const inputUndefined = {
        value: undefined,
      }
      const inputNumber = {
        value: 1234567890,
      }
      const invalidInputNumber = {
        value: 'ajksdlfjlk',
      }

      expect(falsyOrNumber(inputNull)).toBeNull()
      expect(falsyOrNumber(inputUndefined)).toBeNull()
      expect(falsyOrNumber(inputNumber)).toBeNull()
      expect(falsyOrNumber(invalidInputNumber)).not.toBeNull()
    })
  })
  describe('inPast', () => {
    it('returns a function', () => {
      expect(inPast).toBeInstanceOf(Function)
    })

    it('evaluates null values', () => {
      const inputEarlierThanNow = { value: 100 }

      expect(inPast(inputEarlierThanNow)).toBeNull()
    })

    it('returns a custom error message when invalid', () => {
      const newDate = new Date()
      const inputLaterThanNow = { value: newDate.getTime() + 1000 }

      expect(inPast(inputLaterThanNow)).toStrictEqual({
        custom: `Vul een tijdstip uit het verleden in`,
      })
    })
  })

  describe('nullOrNumber', () => {
    it('returns a function', () => {
      expect(nullOrNumber).toBeInstanceOf(Function)
    })

    it('evaluates null values', () => {
      const inputNull = {
        value: null,
      }

      const inputNumber = {
        value: 1234567890,
      }

      expect(nullOrNumber()(inputNull)).toBeNull()
      expect(nullOrNumber()(inputNumber)).toBeNull()
    })
  })
})
