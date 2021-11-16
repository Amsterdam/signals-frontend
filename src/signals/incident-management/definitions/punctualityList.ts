// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
enum PunctualityKey {
  ON_TIME = 'on_time',
  LATE = 'late',
  LATE_FACTOR_3 = 'late_factor_3',
}

export type Punctuality = {
  key: PunctualityKey
  value: string
}

const punctualityList: Array<Punctuality> = [
  {
    key: PunctualityKey.ON_TIME,
    value: 'Binnen de afhandeltermijn',
  },
  {
    key: PunctualityKey.LATE,
    value: 'Buiten de afhandeltermijn',
  },
  {
    key: PunctualityKey.LATE_FACTOR_3,
    value: '3x buiten de afhandeltermijn',
  },
]

export default punctualityList
