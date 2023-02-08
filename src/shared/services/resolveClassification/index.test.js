// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

import resolveClassification, {
  MINIMUM_CERTAINTY,
  DEFAULT_CLASSIFICATION,
} from '.'

jest.mock('shared/services/configuration/configuration')

describe('The resolve classification service', () => {
  let hoofdrubriek
  let subrubriek

  beforeEach(() => {
    configuration.featureFlags.enableAmsterdamSpecificOverigCategories = false

    subrubriek = [
      [
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/wildplassen-poepen-overgeven',
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
      ],
      [0.39, 0.1424216693948545, 0.04586915076913858],
    ]

    hoofdrubriek = [
      [
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca',
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte',
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen',
      ],
      [0.39, 0.1424216693948545, 0.04586915076913858],
    ]
  })

  afterEach(() => {
    configuration.__reset()
  })

  it('should return the default classifications', () => {
    expect(resolveClassification()).toEqual({
      category: DEFAULT_CLASSIFICATION,
      subcategory: DEFAULT_CLASSIFICATION,
    })

    expect(resolveClassification({})).toEqual({
      category: DEFAULT_CLASSIFICATION,
      subcategory: DEFAULT_CLASSIFICATION,
    })
  })

  it('should return correct classification when minimum subcategory chance is met', () => {
    subrubriek[1][0] = MINIMUM_CERTAINTY

    expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
      category: 'overlast-in-de-openbare-ruimte',
      subcategory: 'hondenpoep',
    })
  })

  it('should return Overig when minimum maincategory and subcategory chance are not met', () => {
    expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
      category: 'overig',
      subcategory: 'overig',
    })
  })

  describe('use main classification when sub category fails', () => {
    describe('afval', () => {
      it('should return overig-afval when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'afval',
          subcategory: 'overig-afval',
        })
      })
    })

    describe('schoon', () => {
      it('should return veegzwerfvuil when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/schoon'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'schoon',
          subcategory: 'veegzwerfvuil',
        })
      })
    })

    describe('openbaar-groen-en-water', () => {
      it('should return overig-groen-en-water when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'openbaar-groen-en-water',
          subcategory: 'overig-groen-en-water',
        })
      })
    })

    describe('overlast-bedrijven-en-horeca', () => {
      it('should return overig-horecabedrijven when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'overlast-bedrijven-en-horeca',
          subcategory: 'overig-horecabedrijven',
        })
      })
    })

    describe('overlast-in-de-openbare-ruimte', () => {
      it('should return overig-openbare-ruimte when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'overlast-in-de-openbare-ruimte',
          subcategory: 'overig-openbare-ruimte',
        })
      })
    })

    describe('overlast-op-het-water', () => {
      it('should return overig-boten when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-op-het-water'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'overlast-op-het-water',
          subcategory: 'overig-boten',
        })
      })
    })

    describe('overlast-van-dieren', () => {
      it('should return overig-dieren when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'overlast-van-dieren',
          subcategory: 'overig-dieren',
        })
      })
    })

    describe('overlast-van-en-door-personen-of-groepen', () => {
      it('should return overige-overlast-door-personen when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'overlast-van-en-door-personen-of-groepen',
          subcategory: 'overige-overlast-door-personen',
        })
      })
    })

    describe('wegen-verkeer-straatmeubilair', () => {
      it('should return overig-wegen-verkeer-straatmeubilair when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'wegen-verkeer-straatmeubilair',
          subcategory: 'overig-wegen-verkeer-straatmeubilair',
        })
      })
    })

    describe('wonen', () => {
      it('should return wonen-overig when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wonen'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'wonen',
          subcategory: 'wonen-overig',
        })
      })
    })

    describe('unknown-category-with-amsterdam-overig-categories-on', () => {
      it('should return overig when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = true

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/unknown-category'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'unknown-category',
          subcategory: 'overig',
        })
      })
    })

    describe('unknown-category-with-amsterdam-overig-categories-off', () => {
      it('should return overig when minimum subcategory chance is not met and maincategory chance is met', () => {
        configuration.featureFlags.enableAmsterdamSpecificOverigCategories = false

        hoofdrubriek[0][0] =
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/unknown-category'
        hoofdrubriek[1][0] = MINIMUM_CERTAINTY

        expect(resolveClassification({ subrubriek, hoofdrubriek })).toEqual({
          category: 'unknown-category',
          subcategory: 'overig-unknown-category',
        })
      })
    })
  })
})
