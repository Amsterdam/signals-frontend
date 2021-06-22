// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import * as requests from '../../support/commandsRequests'
import { generateToken } from '../../support/jwt'
import * as routes from '../../support/commandsRouting'
import * as filters from '../../support/commandsFiltering'

describe('Testdata', () => {
  it('Should setup the testdata', () => {
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/afval/sub_categories/overig-afval`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/civiele-constructies/sub_categories/afwatering-brug`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/ondermijning/sub_categories/vermoeden`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/eikenprocessierups`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/overig/sub_categories/overige-dienstverlening`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overlast-terrassen`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/markten`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/olie-op-het-water`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overlast-door-afsteken-vuurwerk`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/schoon/sub_categories/uitwerpselen`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/parkeerautomaten`
    )
    requests.createPublicSignalForFilters(
      `${Cypress.env(
        'backendUrl'
      )}/signals/v1/public/terms/categories/wonen/sub_categories/vakantieverhuur`
    )
  })
})
describe('Filter by category', () => {
  beforeEach(() => {
    routes.getManageSignalsRoutes()
    routes.deleteFilterRoute()
    routes.getFilteredSignalsRoute()
    routes.postFilterRoute()
    localStorage.setItem(
      'accessToken',
      generateToken('Admin', 'signals.admin@example.com')
    )
    cy.visit('/manage/incidents/')

    routes.waitForManageSignalsRoutes()
  })
  it('Should filter by category Afval', () => {
    filters.filterByCategorySlug('overig-afval', 'Overig afval')
  })
  it('Should filter by category Civiele constructies', () => {
    filters.filterByCategorySlug('afwatering-brughasdhasdf', 'Afwatering brug')
  })
  it('Should filter by category Ondermijning', () => {
    filters.filterByCategorySlug('vermoeden', 'Vermoedennasdnasdf')
  })
  it('Should filter by category Openbaar groen en water', () => {
    filters.filterByCategorySlug('eikenprocessierups', 'Eikenprocessierups')
  })
  it('Should filter by category Overig', () => {
    filters.filterByCategorySlug(
      'overige-dienstverlening',
      'Overige dienstverlening'
    )
  })
  it('Should filter by category Overlast bedrijven en horeca', () => {
    filters.filterByCategorySlug('overlast-terrassen', 'Overlast terrassen')
  })
  it('Should filter by category Overlast in de openbare ruimte', () => {
    filters.filterByCategorySlug('markten', 'Markten')
  })
  it('Should filter by category Overlast op het water', () => {
    filters.filterByCategorySlug('olie-op-het-water', 'Olie op het water')
  })
  it('Should filter by category Overlast van dieren', () => {
    filters.filterByCategorySlug('ganzen', 'Ganzen')
  })
  it('Should filter by category Overlast van en door personen of groepen', () => {
    filters.filterByCategorySlug(
      'overlast-door-afsteken-vuurwerk',
      'Overlast door afsteken vuurwerk'
    )
  })
  it('Should filter by category Schoon', () => {
    filters.filterByCategorySlug('uitwerpselen', 'Uitwerpselen')
  })
  it('Should filter by category Wegen verkeer straatmeubilair', () => {
    filters.filterByCategorySlug('parkeerautomaten', 'Parkeerautomaten')
  })
  it('Should filter by category Wonen', () => {
    filters.filterByCategorySlug('vakantieverhuur', 'Vakantieverhuur')
  })
})
