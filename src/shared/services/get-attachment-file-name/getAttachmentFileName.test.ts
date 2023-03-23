// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { getAttachmentFileName } from './getAttachmentFileName'

describe('getAttachmentFileName', () => {
  it('should return correct name of svg', () => {
    const location =
      'https://siaweuaaks.blob.core.windows.net/files/attachments/2023/03/22/Screenshot_2022-11-01_at_15.46.27.png?se=2023-03-22T11%3A03%3A51Z&sp=r&sv=2021-08-06&sr=b&sig=70zthscotauInCE8pFi5Ku5fcoxj5rAL/PTc8VrCw48%3D'
    const result = getAttachmentFileName(location)

    expect(result).toEqual('Screenshot_2022-11-01_at_15.46.27.png')
  })

  it('should return correct name of PDF', () => {
    const location =
      'https://siaweuaaks.blob.core.windows.net/files/attachments/2023/03/22/221128_concept_gesprekswijzer_mijn_amsterdams_gesprek_1.pdf?se=2023-03-22T11%3A07%3A45Z&sp=r&sv=2021-08-06&sr=b&sig=KWlcHinTvgLTFPnjVQSdwSceicgjqB7gL/4qjFuYwuM%3D'
    const result = getAttachmentFileName(location)

    expect(result).toEqual(
      '221128_concept_gesprekswijzer_mijn_amsterdams_gesprek_1.pdf'
    )
  })

  it('should return an empty string when location is empty', () => {
    const location = ''
    const result = getAttachmentFileName(location)

    expect(result).toEqual('')
  })
})
