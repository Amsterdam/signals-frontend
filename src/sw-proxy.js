// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
/* global proxyConfig */
/* eslint no-restricted-globals: ["error"] */
/* eslint-disable no-console, promise/avoid-new */

self.importScripts('./sw-proxy-config.js')

const handleInstall = () => {
  console.log('[SW-PROXY] service worker installed')
  self.skipWaiting()
}

const handleActivate = () => {
  console.log('[SW-PROXY] service worker activated')

  return self.clients.claim()
}

const delayResponse = (time, response) =>
  new Promise((resolve) => setTimeout(() => resolve(response), time))

const compose = (...fns) => (x) => fns.reduce((res, f) => res || f(x), false)

const getProxyConfig = ({ url, method }) => {
  const exactUrlMatch = ({ request }) =>
    url.startsWith(request.url) && method === request.method

  const patternUrlMatch = ({ request }) =>
    request.url.includes('*') &&
    new RegExp(request.url.replace('*', '(.+)')).test(url) &&
    method === request.method

  const exactOrPatternMatch = compose(exactUrlMatch, patternUrlMatch)

  return proxyConfig.find(exactOrPatternMatch)
}

/**
 * Handler for proxied requests
 *
 * @param {FetchEvent} event - event type for fetch events dispatched on the service worker global scope
 */
const handleFetch = (event) => {
  const proxyConfig = getProxyConfig(event.request)

  if (proxyConfig) {
    const { request, response } = proxyConfig

    const defaultResponseHeaders = { 'Content-Type': 'application/json' }
    const defaultResponseStatus = 200

    const responseConfig = {
      headers: response.headers || defaultResponseHeaders,
      method: request.method,
      status: response.status || defaultResponseStatus,
      statusText: response.statusText,
      url: event.request.url,
    }

    let proxyResponse

    if (response.body) {
      const body =
        responseConfig.headers['Content-Type'] === 'application/json'
          ? JSON.stringify(response.body)
          : response.body

      proxyResponse = Promise.resolve(new Response(body, responseConfig))
    } else if (response.file) {
      proxyResponse = fetch(`${self.origin}/${response.file}`)
    } else {
      proxyResponse = Promise.resolve(new Response(undefined, responseConfig))
    }

    const msg = `[SW-PROXY] proxying request ${event.request.method}: ${event.request.url}`
    console.log(`${msg} ${response.file ? `-> serving: ${response.file}` : ''}`)

    event.waitUntil(
      Promise.resolve(
        event.respondWith(
          response.delay
            ? delayResponse(response.delay, proxyResponse)
            : proxyResponse
        )
      )
    )
  }
}

self.addEventListener('install', handleInstall)
self.addEventListener('activate', handleActivate)
self.addEventListener('fetch', handleFetch)
