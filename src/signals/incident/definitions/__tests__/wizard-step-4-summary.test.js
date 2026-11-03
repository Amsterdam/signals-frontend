// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2024 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

import PreviewComponents from '../../components/IncidentPreview/components'
import step4, {
  Label,
  Null,
  ObjectLabel,
  renderPreview,
  SCSVLabel,
  summary,
} from '../wizard-step-4-summary'

const { previewFactory } = step4

jest.mock('shared/services/configuration/configuration')
jest.mock('lodash/memoize', () => ({
  __esModule: true,
  default: jest.fn((fn) => fn),
}))

const expectedLocation = {
  locatie: {
    label: 'Waar is het?',
    optional: true,
    render: expect.any(Function),
    canBeNull: false,
  },
}

describe('Wizard summary', () => {
  afterEach(() => {
    configuration.__reset()
  })

  describe('renderPreview', () => {
    it('should return the correct component', () => {
      expect(renderPreview({ render: 'RadioInputGroup' })).toEqual(ObjectLabel)
      expect(renderPreview({ render: 'TextInput' })).toEqual(Label)
      expect(renderPreview({ render: 'TextareaInput' })).toEqual(Label)
      expect(renderPreview({ render: 'MultiTextInput' })).toEqual(SCSVLabel)
      expect(
        renderPreview({ render: 'CheckboxInput', meta: { values: {} } })
      ).toEqual(PreviewComponents.ListObjectValue)
      expect(
        renderPreview({ render: 'CheckboxInput', meta: { value: '' } })
      ).toEqual(expect.any(Function))
      expect(renderPreview({ render: 'SomethingElse' })).toEqual(Null)
    })
  })

  describe('summary', () => {
    const controls = {
      extra_bedrijven_horeca_wat: {
        meta: {
          label: 'Uw melding gaat over:',
          canBeNull: true,
        },
        options: { validators: ['required'] },
        render: 'RadioInputGroup',
      },
      extra_bedrijven_horeca_naam: {
        meta: {
          label: 'Wie of wat zorgt voor deze overlast, denkt u?',
        },
        render: 'TextInput',
      },
    }

    it('should return mapped values', () => {
      expect(summary(controls)).toStrictEqual({
        extra_bedrijven_horeca_wat: {
          label: 'Uw melding gaat over:',
          optional: true,
          render: ObjectLabel,
          canBeNull: true,
        },
        extra_bedrijven_horeca_naam: {
          label: 'Wie of wat zorgt voor deze overlast, denkt u?',
          optional: true,
          render: Label,
          canBeNull: false,
        },
      })
    })
  })

  describe('Hard coded questions', () => {
    const beschrijfContact = {
      beschrijf: {
        classification: {
          authenticated: true,
          label: 'Subcategorie',
          render: expect.any(Function),
        },
        description: {
          label: 'Waar gaat het over?',
          render: expect.any(Function),
        },
        images_previews: {
          label: "Foto's toevoegen",
          optional: true,
          render: expect.any(Function),
        },
        priority: {
          authenticated: true,
          label: 'Urgentie',
          render: expect.any(Function),
        },
        source: {
          authenticated: true,
          label: 'Bron',
          render: expect.any(Function),
        },
      },
      contact: {
        email: {
          label: 'Wat is uw e-mailadres?',
          optional: true,
          render: expect.any(Function),
        },
        phone: {
          label: 'Wat is uw telefoonnummer?',
          optional: true,
          render: expect.any(Function),
        },
        sharing_allowed: {
          label: 'Melding delen',
          optional: true,
          render: expect.any(Function),
        },
      },
    }

    it('should return questions based on category', () => {
      configuration.featureFlags.showVulaanControls = true
      const actual = previewFactory({
        category: 'afval',
        subcategory: 'subcategory',
      })

      const expected = {
        ...beschrijfContact,
        vulaan: {
          dateTime: {
            canBeNull: true,
            label: 'Wanneer was het?',
            optional: true,
            render: PreviewComponents.DateTime,
          },
          ...expectedLocation,
        },
      }

      expect(actual).toEqual(expect.objectContaining(expected))
    })

    it('should return no extra questions with non existing category', () => {
      configuration.featureFlags.showVulaanControls = true
      const actual = previewFactory({
        category: 'category',
        subcategory: 'subcategory',
      })
      const expected = expect.objectContaining({
        ...beschrijfContact,
        vulaan: expectedLocation,
      })

      expect(actual).toEqual(expected)
    })

    it('should return empty controls when showVulaanControls is false', () => {
      expect(previewFactory({ category: 'afval' }).vulaan).toEqual({
        ...expectedLocation,
      })
    })
  })

  describe('Fetch questions from backend', () => {
    beforeEach(() => {
      configuration.featureFlags.showVulaanControls = true
      configuration.featureFlags.fetchQuestionsFromBackend = true
    })

    it('should return location control when no questions given', () => {
      const actual = previewFactory({
        category: 'category',
        subcategory: 'subcategory',
      })
      const expected = expect.objectContaining({
        vulaan: {
          ...expectedLocation,
        },
      })

      expect(actual).toEqual(expected)
    })

    it('should return controls when questions given', () => {
      const actual = previewFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            meta: { label: 'Label' },
            render: 'TextInput',
          },
        },
      })
      const expected = expect.objectContaining({
        vulaan: {
          key1: {
            label: 'Label',
            optional: true,
            render: Label,
          },
        },
      })

      expect(actual).toEqual(expected)
    })

    it('should fall back to short label', () => {
      const actual = previewFactory({
        category: 'category',
        subcategory: 'subcategory',
        questions: {
          key1: {
            meta: { shortLabel: 'Label' },
            render: 'TextInput',
            required: true,
          },
        },
      })
      const expected = expect.objectContaining({
        vulaan: {
          key1: {
            label: 'Label',
            optional: false,
            render: Label,
          },
        },
      })

      expect(actual).toEqual(expected)
    })
  })
})
