// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import memoize from 'lodash/memoize'

import configuration from 'shared/services/configuration/configuration'

import FormComponents from '../../components/form'
import step2 from '../wizard-step-2-vulaan'
import location from '../wizard-step-2-vulaan/locatie'

const { formFactory } = step2
const defaultControls = {
  error: expect.objectContaining({}),
  $field_0: expect.objectContaining({}),
  help_text: expect.objectContaining({
    meta: {
      ignoreVisibility: true,
      label: configuration.language.helpTextHeader,
      value: configuration.language.helpText,
    },
  }),
}

jest.mock('shared/services/configuration/configuration')
jest.mock('lodash/memoize', () => ({
  __esModule: true,
  default: jest.fn((fn) => fn),
}))

const locatie = {
  ...location,
  options: {
    validators: ['required'],
  },
  render: expect.any(Function),
}

describe('Wizard step 2 vulaan, formFactory', () => {
  afterEach(() => {
    configuration.__reset()
  })

  describe('Hard coded questions', () => {
    it('should only return location when category does not match', () => {
      configuration.featureFlags.showVulaanControls = true
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
      })
      const expected = {
        controls: {
          ...defaultControls,
          locatie,
        },
      }

      expect(actual).toEqual(expected)
    })

    it('should return empty controls when showVulaanControls is false', () => {
      configuration.featureFlags.showVulaanControls = false

      expect(formFactory({ category: 'afval' }).controls).toEqual({
        ...defaultControls,
        locatie,
      })
    })
  })

  describe('Fetch questions from backend', () => {
    beforeEach(() => {
      configuration.featureFlags.showVulaanControls = true
      configuration.featureFlags.fetchQuestionsFromBackend = true
    })

    it('should return location control when no questions given', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
      })
      const expected = {
        controls: {
          ...defaultControls,
          locatie,
        },
      }

      expect(actual).toEqual(expected)
    })

    it('should return controls when questions given', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            render: 'TextInput',
          },
        },
      })
      const expected = {
        controls: {
          ...defaultControls,
          key1: {
            options: { validators: [] },
            render: FormComponents.TextInput,
          },
        },
      }

      expect(actual).toEqual(expected)
    })

    it('should expand validators', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            options: {
              validators: ['required'],
            },
            render: 'TextInput',
          },
        },
      })
      const expected = {
        controls: {
          ...defaultControls,
          key1: {
            options: { validators: ['required'] },
            render: FormComponents.TextInput,
          },
        },
      }

      expect(actual).toEqual(expected)
    })

    it('should expand multiple validators', () => {
      const actual = formFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            options: {
              validators: ['required', 'email'],
            },
            render: 'TextInput',
          },
        },
      })
      const expected = {
        controls: {
          ...defaultControls,
          key1: {
            options: { validators: ['required', 'email'] },
            render: FormComponents.TextInput,
          },
        },
      }

      expect(actual).toEqual(expected)
    })

    it('should memoize with cache key on category and subcategory', () => {
      formFactory({})
      expect(memoize).toHaveBeenCalled()

      const actual = memoize.mock.calls[0][1](
        'questions',
        'category',
        'subcategory'
      )
      const expected = 'categorysubcategory'
      expect(actual).toBe(expected)
    })
  })
})
