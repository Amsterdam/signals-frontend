// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import categories from 'utils/__tests__/fixtures/categories_structured.json'
import usersJSON from 'utils/__tests__/fixtures/users.json'

import filterData from './filterData'

const colMap = {
  id: 'id',
  is_active: 'Status',
  roles: 'Rol',
  username: 'Gebruikersnaam',
}

describe('filterData', () => {
  it('should filter out keys', () => {
    const filteredData = filterData(usersJSON.results, colMap)
    const filteredKeys = Object.keys(filteredData[0]).sort()

    expect(filteredKeys.includes('_displays')).toEqual(false)
    expect(filteredKeys.includes('_links')).toEqual(false)
    expect(filteredKeys.includes('profile')).toEqual(false)
  })

  it('should turn boolean values into strings', () => {
    const containsBoolean = (obj) =>
      Object.values(obj).some((val) => typeof val === 'boolean')

    expect(containsBoolean(usersJSON.results[0])).toEqual(true)

    const filteredData = filterData(usersJSON.results, colMap)

    expect(containsBoolean(filteredData[0])).toEqual(false)
  })

  it('should turn array values into strings', () => {
    const containsArray = (obj) =>
      Object.values(obj).some((val) => Array.isArray(val))

    expect(
      containsArray(usersJSON.results.find(({ id }) => id === 34))
    ).toEqual(true)

    const filteredData = filterData(usersJSON.results, colMap)

    expect(containsArray(filteredData.find(({ id }) => id === 34))).toEqual(
      false
    )
  })

  it('should map labels', () => {
    const filteredData = filterData(usersJSON.results, colMap)
    const filteredKeys = Object.keys(filteredData[0]).sort()
    const mapValues = Object.values(colMap).sort()

    expect(filteredKeys).toEqual(mapValues)
  })

  it('should return empty array', () => {
    expect(filterData(undefined, colMap)).toEqual([])
    expect(filterData(null, colMap)).toEqual([])
    expect(filterData(0, colMap)).toEqual([])
  })

  it('should return public name if existing or else return default value', () => {
    const colMapCategories = {
      fk: 'fk',
      id: 'id',
      value: 'Hoofdcategorie',
      public_name: 'Openbare Naam',
      _links: 'Icoon',
    }

    const mockMainCategories = [
      categories.afval,
      categories['wegen-verkeer-straatmeubilair'],
    ]
    const filteredData = filterData(mockMainCategories, colMapCategories)

    expect(filteredData[0]['Openbare Naam']).toEqual('Afval')
    expect(filteredData[1]['Openbare Naam']).toEqual(
      'Wegen, verkeer, straatmeubilair - publiek'
    )
  })

  it('should return icon if existing else return "Niet ingesteld', () => {
    const colMapCategories = {
      fk: 'fk',
      id: 'id',
      value: 'Hoofdcategorie',
      public_name: 'Openbare Naam',
      _links: 'Icoon',
    }

    const mockMainCategories = [
      categories.afval,
      categories['wegen-verkeer-straatmeubilair'],
    ]
    const filteredData = filterData(mockMainCategories, colMapCategories)

    expect(filteredData[0]['Icoon']).toEqual('Niet ingesteld')
    expect(filteredData[1]['Icoon']).toEqual(
      'https://siaweuaaks.blob.core.windows.net/files/icons/categories/0-hoofdcategorie-test/glas-icon.svg?se=2023-04-24T11%3A56%3A30Z&sp=r&sv=2021-08-06&sr=b&sig=cAl/7CfiwBu1yE/whi6bxc8BMlIxP9CHtnyO9YoapdA%3D'
    )
  })
})
