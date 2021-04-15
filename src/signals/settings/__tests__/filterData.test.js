// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import usersJSON from 'utils/__tests__/fixtures/users.json';
import filterData from '../filterData';

const colMap = {
  id: 'id',
  is_active: 'Status',
  roles: 'Rol',
  username: 'Gebruikersnaam',
};

describe('signals/settings/users/containers/Overview/hooks/filterData', () => {
  it('should filter out keys', () => {
    const filteredData = filterData(usersJSON.results, colMap);
    const filteredKeys = Object.keys(filteredData[0]).sort();

    expect(filteredKeys.includes('_displays')).toEqual(false);
    expect(filteredKeys.includes('_links')).toEqual(false);
    expect(filteredKeys.includes('profile')).toEqual(false);
  });

  it('should turn boolean values into strings', () => {
    const containsBoolean = obj => Object.values(obj).some(
      val => typeof val === 'boolean'
    );

    expect(containsBoolean(usersJSON.results[0])).toEqual(true);

    const filteredData = filterData(usersJSON.results, colMap);

    expect(containsBoolean(filteredData[0])).toEqual(false);
  });

  it('should turn array values into strings', () => {
    const containsArray = obj => Object.values(obj).some(
      val => Array.isArray(val)
    );

    expect(containsArray(usersJSON.results.find(({ id }) => id === 34))).toEqual(true);

    const filteredData = filterData(usersJSON.results, colMap);

    expect(containsArray(filteredData.find(({ id }) => id === 34))).toEqual(false);
  });

  it('should map labels', () => {
    const filteredData = filterData(usersJSON.results, colMap);
    const filteredKeys = Object.keys(filteredData[0]).sort();
    const mapValues = Object.values(colMap).sort();

    expect(filteredKeys).toEqual(mapValues);
  });

  it('should return empty array', () => {
    expect(filterData(undefined, colMap)).toEqual([]);
    expect(filterData(null, colMap)).toEqual([]);
    expect(filterData(0, colMap)).toEqual([]);
  });
});
