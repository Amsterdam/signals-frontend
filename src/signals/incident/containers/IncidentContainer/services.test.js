// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { getIncidentClassification, resolveQuestions } from './services'

const mockedQuestions = [
  {
    key: 'key1',
    meta: {
      metaProp: 'metaProp',
    },
    field_type: 'checkbox_input',
  },
  {
    key: 'key2',
    meta: {
      validators: ['required', ['maxLength', 100]],
    },
    field_type: 'radio_input',
  },
  {
    key: 'key3',
    field_type: 'location_select',
    required: true,
  },
  {
    key: 'key4',
    meta: {
      validators: ['required', ['maxLength', 100]],
    },
    field_type: 'select_input',
    required: true,
  },
]

describe('Incident container services', () => {
  describe('resolveQuestions', () => {
    it('should return empty object without questions', () => {
      const result = resolveQuestions([])
      expect(result).toEqual({})
    })

    it('should return the questions mapped to their key property', () => {
      const result = resolveQuestions(mockedQuestions)
      expect(result).toHaveProperty('key1')
      expect(result).toHaveProperty('key2')
      expect(result).toHaveProperty('key3')
      expect(result).toHaveProperty('key4')
      expect(Object.keys(result).length).toBe(4)
    })

    it('should pass meta prop', () => {
      const result = resolveQuestions(mockedQuestions)
      expect(result.key1).toMatchObject({
        meta: {
          metaProp: 'metaProp',
          pathMerge: 'extra_properties',
        },
      })
      expect(result.key2).toMatchObject({
        meta: {},
      })
    })

    it('should not add extra_properties prop to meta when field type is location', () => {
      const result = resolveQuestions(mockedQuestions)
      expect(result.key1).toMatchObject({
        meta: {
          pathMerge: 'extra_properties',
        },
      })
      expect(result.key2).toMatchObject({
        meta: {
          pathMerge: 'extra_properties',
        },
      })
      expect(result.key3).not.toMatchObject({
        meta: {
          pathMerge: 'extra_properties',
        },
      })
      expect(result.key4).toMatchObject({
        meta: {
          pathMerge: 'extra_properties',
        },
      })
    })

    it('should add render prop', () => {
      const result = resolveQuestions(mockedQuestions)
      expect(result.key1).toMatchObject({
        render: 'CheckboxInput',
      })
      expect(result.key2).toMatchObject({
        render: 'RadioInputGroup',
      })
    })

    it('should add options prop with validators', () => {
      const result = resolveQuestions(mockedQuestions)
      expect(result.key1).toMatchObject({
        options: {
          validators: [],
        },
      })
      expect(result.key2).toMatchObject({
        options: {
          validators: ['required', ['maxLength', 100]],
        },
      })
      expect(result.key3).toMatchObject({
        options: {
          validators: ['required'],
        },
      })
      expect(result.key4).toMatchObject({
        options: {
          validators: ['required', ['maxLength', 100]],
        },
      })
    })
  })
  describe('getIncidentClassification', () => {
    it('should return incidentPart without classifications', () => {
      const incidentPart = { category: 'incidentPart' }
      const expected = incidentPart
      const actual = getIncidentClassification({ incident: {} }, incidentPart)
      expect(actual).toEqual(expected)
    })

    it('should return incidentPart when classificationPrediction is null', () => {
      const incidentPart = { category: 'incidentPart' }
      const expected = incidentPart
      const actual = getIncidentClassification(
        {
          classificationPrediction: null,
          incident: { classification: { slug: 'slug' } },
        },
        incidentPart
      )
      expect(actual).toEqual(expected)
    })

    it('should return incidentPart when incident classification is null', () => {
      const incidentPart = { category: 'incidentPart' }
      const expected = incidentPart
      const actual = getIncidentClassification(
        {
          classificationPrediction: { slug: 'slug' },
          incident: { classification: null },
        },
        incidentPart
      )
      expect(actual).toEqual(expected)
    })

    it('should return incidentPart when classificationPrediction and incident classification are equal', () => {
      const incidentPart = { category: 'incidentPart' }
      const expected = incidentPart
      const actual = getIncidentClassification(
        {
          classificationPrediction: { slug: 'slug' },
          incident: { classification: { slug: 'slug' } },
        },
        incidentPart
      )
      expect(actual).toEqual(expected)
    })

    it('should return empty object otherwise', () => {
      const incidentPart = { category: 'incidentPart' }
      const expected = {}
      const actual = getIncidentClassification(
        {
          classificationPrediction: { slug: 'slug' },
          incident: { classification: { slug: 'other' } },
        },
        incidentPart
      )
      expect(actual).toEqual(expected)
    })
  })
})
