// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
export default class MaxSelection<T = string> {
  public readonly set: Set<T>
  private readonly max: number

  // Extension of built-in Set
  // Note: Set not extended using: `class MaxSelction extend Set`
  //        extend does not work when babel is changing these built-in types
  public constructor(max: number, initial: T[] = []) {
    this.set = new Set(initial)
    this.max = max
  }

  public add(value: T) {
    if (this.set.size < this.max) {
      this.set.add(value)
    }
  }

  public has(value: T) {
    return this.set.has(value)
  }

  public delete(value: T) {
    return this.set.delete(value)
  }

  public toggle(value: T) {
    if (this.has(value)) {
      this.delete(value)
    } else {
      this.add(value)
    }
  }
}
