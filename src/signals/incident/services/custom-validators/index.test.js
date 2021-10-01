// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import {
  validateFileType,
  validateMaxFilesize,
  validateMinFilesize,
  validatePhoneNumber,
  createRequired,
} from '.'

describe('The custom validators service', () => {
  describe('should validate file type', () => {
    const meta = {
      allowedFileTypes: ['image/jpeg', 'application/pdf'],
    }

    it('with correct file type', () => {
      const file = {
        type: 'application/pdf',
      }
      expect(validateFileType(file, meta)).toEqual(null)
    })

    it('with incorrect file type', () => {
      const file = {
        type: 'image/png',
      }

      expect(validateFileType(file, meta)).toEqual({
        custom:
          'Dit bestand heeft niet het juiste type (png). Toegestaan zijn: jpeg, pdf.',
      })
    })

    it('with empty value', () => {
      expect(validateFileType()).toEqual(null)
    })
  })

  describe('should validate file size', () => {
    const meta = {
      minFileSize: 30 * 2 ** 10,
      maxFileSize: 8 * 2 ** 20,
    }

    it('not exceed max file size', () => {
      const file = {
        size: meta.maxFileSize - 1,
      }

      expect(validateMaxFilesize(file, meta)).toEqual(null)
    })

    it('to exceed max file size', () => {
      const file = {
        size: meta.maxFileSize,
      }

      expect(validateMaxFilesize(file, meta)).toEqual({
        custom:
          'Dit bestand is te groot (8 MB). Maximale bestandgrootte is 8 MB.',
      })
    })

    it('to be equal to or exceed min file size', () => {
      const file = {
        size: meta.minFileSize,
      }

      expect(validateMinFilesize(file, meta)).toEqual(null)
    })

    it('not exceed min file size', () => {
      const file = {
        size: meta.minFileSize - 1,
      }

      expect(validateMinFilesize(file, meta)).toEqual({
        custom:
          'Dit bestand is te klein (30 kB). Minimale bestandgrootte is 30 kB.',
      })
    })

    it('exceed min file size and not exceed max file size', () => {
      const file = {
        size: meta.maxFileSize - 1,
      }

      expect(validateMinFilesize(file, meta)).toEqual(null)
      expect(validateMaxFilesize(file, meta)).toEqual(null)
    })

    it('with empty value', () => {
      expect(validateMaxFilesize()).toEqual(null)
      expect(validateMinFilesize()).toEqual(null)
    })
  })

  describe('should validate telephone number', () => {
    const error =
      'Ongeldig telefoonnummer, alleen cijfers, spaties, haakjes, + en - zijn toegestaan.'
    const meta = {
      maxFileSize: 8388608,
    }

    it('with correct telephone number', () => {
      const control = {
        value: '+31 (20) 6793-793',
      }

      expect(validatePhoneNumber(control, meta)).toEqual(null)
    })

    it('with undefined telephone number', () => {
      const control = {
        value: undefined,
      }

      expect(validatePhoneNumber(control, meta)).toEqual(null)
    })

    it('with incorrect telephone number with letter', () => {
      const file = {
        value: '+3120-6a',
      }

      expect(validatePhoneNumber(file, meta)).toEqual({
        custom: error,
      })
    })

    it('with incorrect telephone number with incorrect chars', () => {
      const file = {
        value: '+3120-6 *&',
      }

      expect(validatePhoneNumber(file, meta)).toEqual({
        custom: error,
      })
    })

    it('with empty value', () => {
      expect(validatePhoneNumber()).toEqual(null)
    })
  })

  describe('validate required input', () => {
    const error = 'Veplicht'

    it('returns error if value is incorrect', () => {
      let input = {
        value: null,
      }
      expect(createRequired(error)(input)).toEqual({ required: error })

      input = {}
      expect(createRequired(error)(input)).toEqual({ required: error })

      input = {
        value: '',
      }
      expect(createRequired(error)(input)).toEqual({ required: error })
    })

    it('returns null if value is correct', () => {
      let input = {
        value: 'valid',
      }
      expect(createRequired(error)(input)).toEqual(null)
    })

    it('returns a function with name "required"', () => {
      expect(createRequired().name).toBe('required')
    })
  })
})
