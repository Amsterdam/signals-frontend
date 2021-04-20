// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
/**
 * Test the request function
 */

import request from './request'

describe('request', () => {
  // Before each test, stub the fetch function
  beforeEach(() => {
    window.fetch = jest.fn()
  })

  describe('stubbing successful response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('{"hello":"world"}', {
        status: 200,
        headers: {
          'Content-type': 'application/json',
        },
      })

      window.fetch.mockReturnValue(Promise.resolve(res))
    })

    it('should format the response correctly', (done) => {
      request('/thisurliscorrect')
        .catch(done)
        .then((json) => {
          expect(json.hello).toBe('world')
          done()
        })
    })
  })

  describe('stubbing 204 response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('', {
        status: 204,
        statusText: 'No Content',
      })

      window.fetch.mockReturnValue(Promise.resolve(res))
    })

    it('should return null on 204 response', (done) => {
      request('/thisurliscorrect')
        .catch(done)
        .then((json) => {
          expect(json).toBeNull()
          done()
        })
    })
  })

  describe('stubbing error response', () => {
    // Before each test, pretend we got an unsuccessful response
    beforeEach(() => {
      const res = new Response('', {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-type': 'text/html',
        },
      })

      window.fetch.mockReturnValue(Promise.resolve(res))
    })

    it('should catch errors', (done) => {
      request('/thisdoesntexist').catch((error) => {
        expect(error.response.status).toBe(404)
        expect(error.response.statusText).toBe('Not Found')
        done()
      })
    })
  })

  describe('stubbing error json response', () => {
    // Before each test, pretend we got an unsuccessful response
    beforeEach(() => {
      const res = new Response('{"message":"too late"}', {
        status: 412,
        statusText: 'Precondition Failed',
        headers: {
          'Content-type': 'application/json',
        },
      })

      window.fetch.mockReturnValue(Promise.resolve(res))
    })

    it('should catch json errors', (done) => {
      request('/thisdoesntexist')
        .then((json) => {
          expect(json.message).toBe('too late')
          done()
        })
        .catch((error) => {
          expect(error.response.status).toBe(412)
          expect(error.response.statusText).toBe('Precondition Failed')
          done()
        })
    })
  })
})
