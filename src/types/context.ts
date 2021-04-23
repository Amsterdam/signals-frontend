// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
export default interface Context {
  reporter: {
    signal_count: number;
    open_count: number;
    positive_count: number;
    negative_count: number;
  };
}
