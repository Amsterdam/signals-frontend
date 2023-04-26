// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
export enum Direction {
  UP = 'up',
  DOWN = 'down',
}

export interface ComparisonRateType {
  direction: Direction
  percentage: number
}
