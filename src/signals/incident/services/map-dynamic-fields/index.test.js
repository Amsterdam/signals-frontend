// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import mapDynamicFields from '.'

describe('The map dynamic fields service', () => {
  it('should do nothing by default', () => {
    expect(mapDynamicFields('foo bar', {})).toEqual('foo bar')
  })

  it('should map fields correctly', () => {
    expect(
      mapDynamicFields('foo {incident.id} bar {incident.text}', {
        incident: {
          id: 666,
          text: 'Deze tekst dus',
        },
      })
    ).toEqual('foo 666 bar Deze tekst dus')
  })

  it('should map fields give an error when not found', () => {
    expect(
      mapDynamicFields('foo {incident.id} bar', {
        incident: {},
      })
    ).toEqual('foo onbekend bar')
  })
})
