// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
export default class MaxSelection {
  // Extension of built-in Set
  // Note: Set not extended using: `class MaxSelction extend Set`
  //        extend does not work when babel is changing these built-in types
  constructor(max, initial = []) {
    this.set = new Set(initial)
    this.max = max
  }

  add(value) {
    if (this.set.size < this.max) {
      this.set.add(value)
    }
  }

  has(value) {
    return this.set.has(value)
  }

  delete(value) {
    return this.set.delete(value)
  }

  toggle(value) {
    if (this.has(value)) {
      this.delete(value)
    } else {
      this.add(value)
    }
  }
}
