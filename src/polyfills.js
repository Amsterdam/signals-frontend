// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

/**
 * Object.entries polyfill
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill}
 */
if (!Object.entries) {
  Object.entries = function entries(obj) {
    const ownProps = Object.keys(obj)
    let i = ownProps.length
    const resArray = new Array(i) // preallocate the Array

    // eslint-disable-next-line no-plusplus
    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]]
    }

    return resArray
  }
}

// flat and flatMap polyfill to add support for older Edge browsers
// See https://github.com/behnammodi/polyfill/blob/05f9077132fbff27a4e598a1a088021aa92a02f3/array.polyfill.js#L624
/**
 * Array.prototype.flat()
 * version 0.0.0
 * Feature	        Chrome  Firefox Internet Explorer   Opera	Safari	Edge
 * Basic support	  69      62      (No)    	          56    12      (No)
 * -------------------------------------------------------------------------------
 */
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value: function () {
      var depth =
        typeof arguments[0] === 'undefined' ? 1 : Number(arguments[0]) || 0
      var result = []
      var forEach = result.forEach

      var flatDeep = function (arr, depth) {
        forEach.call(arr, function (val) {
          if (depth > 0 && Array.isArray(val)) {
            flatDeep(val, depth - 1)
          } else {
            result.push(val)
          }
        })
      }

      flatDeep(this, depth)
      return result
    },
  })
}

/**
 * Array.prototype.flatMap()
 * version 0.0.0
 * Feature	        Chrome  Firefox Internet Explorer   Opera	Safari	Edge
 * Basic support	  69      62      (No)    	          56    12      (No)
 * -------------------------------------------------------------------------------
 */
if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', {
    configurable: true,
    writable: true,
    value: function () {
      return Array.prototype.map.apply(this, arguments).flat(1)
    },
  })
}
