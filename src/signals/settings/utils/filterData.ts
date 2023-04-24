// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
type Data = Array<Record<string, any>>
type ColMap = Record<string, any>

/**
 * Clean-up of API response
 *
 * Filtering out invalid keys, turning array values into concatenated strings and
 * converting boolean values to readable text values
 */
const filterData = (data: Data, colMap: ColMap): Array<typeof colMap> => {
  const allowedKeys = Object.keys(colMap)

  return (
    (data &&
      data?.map((item) =>
        Object.keys(item)
          .filter((key) => allowedKeys.includes(key))
          .reduce((rawObj: ColMap, key: string) => {
            const obj = { ...rawObj }
            let value = Array.isArray(item[key])
              ? item[key].join(', ')
              : item[key]

            if (typeof value === 'boolean') {
              value = value ? 'Actief' : 'Niet actief'
            }

            if (key === 'public_name') {
              value = value ? value : 'Niet ingesteld'
            }

            if (key === '_links') {
              // TODO: Make images possible in StyledDataView
              value = value['sia:icon'] ? 'Ingesteld' : 'Niet ingesteld'
            }

            obj[colMap[key]] = value

            return obj
          }, {})
      )) ||
    []
  )
}

export default filterData
