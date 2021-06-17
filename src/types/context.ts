// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
export interface Reporter {
  signal_count: number
  open_count: number
  positive_count: number
  negative_count: number
}

export default interface Context {
  near: {
    signal_count: number
  }
  reporter: Reporter | null
}
