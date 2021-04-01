// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { prefixEndpoints } from './endpoints';

jest.mock('./endpoint-definitions');

describe('shared/services/configuration/endpoints', () => {
  it('should prefix all entries', () => {
    const actual = prefixEndpoints('prefix');
    expect(actual.ENDPOINT_1).toBe('prefix/endpoint/1');
    expect(actual.ENDPOINT_2).toBe('prefix/endpoint/2');
  });

  it('should work with empty prefix', () => {
    const actual = prefixEndpoints('');
    expect(actual.ENDPOINT_1).toBe('/endpoint/1');
    expect(actual.ENDPOINT_2).toBe('/endpoint/2');
  });

  it('should work with null prefix', () => {
    const actual = prefixEndpoints(null);
    expect(actual.ENDPOINT_1).toBe('/endpoint/1');
    expect(actual.ENDPOINT_2).toBe('/endpoint/2');
  });

  it('should work with undefined prefix', () => {
    const actual = prefixEndpoints();
    expect(actual.ENDPOINT_1).toBe('/endpoint/1');
    expect(actual.ENDPOINT_2).toBe('/endpoint/2');
  });
});
