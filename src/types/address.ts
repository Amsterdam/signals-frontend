// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
export interface Address {
  postcode: string
  huisletter?: string | null
  huisnummer: string | number
  woonplaats: string
  openbare_ruimte: string
  huisnummer_toevoeging?: string | number
}
