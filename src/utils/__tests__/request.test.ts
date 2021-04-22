// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
/**
 * Test the request function
 */

import request from '../request'
declare let window: { fetch: jest.Mock }

describe('request', () => {
  // Before each test, stub the fetch function
  beforeEach(() => {
    window.fetch = jest.fn()
  })

  describe('stubbing successful response', () => {
    const resultData = { hello: 'world' }
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response(JSON.stringify(resultData), {
        status: 200,
        headers: {
          'Content-type': 'application/json',
        },
      })

      window.fetch.mockReturnValue(Promise.resolve<Response>(res))
    })

    it('should format the response correctly', (done) => {
      request('/thisurliscorrect')
        .catch(done)
        .then((json) => {

          expect((json as typeof resultData).hello).toBe('world')
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
    const responseData= {"message":"too late"};
    // Before each test, pretend we got an unsuccessful response
    beforeEach(() => {
      const res = new Response(JSON.stringify(responseData), {
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
          expect((json as typeof responseData).message).toBe('too late')
          done()
        })
        .catch((error) => {
          expect(error.response.status).toBe(412)
          expect(error.response.statusText).toBe('Precondition Failed')
          done()
        })
        .catch((error) => {
          expect(error.response.jsonBody.message).toBe('too late')
          expect(error.response.status).toBe(412)
          expect(error.response.statusText).toBe('Precondition Failed')
          done()
        })
    })
  })
})
