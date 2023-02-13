// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
export const getMaxRange = () => {
  const { innerWidth } = window
  const maxWidth = 1400
  const innerWithCalc = innerWidth > maxWidth ? maxWidth : innerWidth
  //padding between charts and margin on sides of charts combined is 160 pixels, Bar Chart gets 2/3 of the available space, Area Chart 1/3
  const maxRange = ((innerWithCalc - 160) / 3) * 2
  //the padding between the bars in the Bar Chart combined is 30 pixels
  return maxRange / 3 - 30
}
