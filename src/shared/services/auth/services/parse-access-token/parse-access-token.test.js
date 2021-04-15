// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import parseAccessToken from './parse-access-token'

/* eslint-disable max-len */
const testAccessToken =
  'abc.eyJuYmYiOjE0ODc4NDMxMjgsImV4cCI6MTQ4Nzg0MzMyOCwianRpIjoiand0SWQiLCJzY29wZXMiOlsiSFIvUiIsIkJSSy9SUyJdLCJpc3MiOiJpc3N1ZXIiLCJzdWIiOiJuYW1lIiwiaWF0IjoxNDg3ODQzMDI4fQ==.xyz'
/* eslint-enable max-len */

describe('The access token parser service', () => {
  it('turns an access token into an object', () => {
    expect(parseAccessToken(testAccessToken)).toEqual({
      issuer: 'issuer',
      name: 'name',
      issuedAt: 1487843028,
      notBefore: 1487843128,
      expiresAt: 1487843328,
      jwtId: 'jwtId',
      scopes: ['HR/R', 'BRK/RS'],
    })
  })

  it('turns empty object when token is incorrect', () => {
    expect(parseAccessToken('incorrect-token')).toEqual({})
  })
})
