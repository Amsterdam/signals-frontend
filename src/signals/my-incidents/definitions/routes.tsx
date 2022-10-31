// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
export const BASE_URL = '/mijn-meldingen'
export const CONFIRM = `${BASE_URL}/bevestig`
export const EXPIRED = `${BASE_URL}/verlopen`
export const REQUEST_ACCESS = `${BASE_URL}/login`

export const routes = {
  baseUrl: BASE_URL,
  confirm: CONFIRM,
  expired: EXPIRED,
  requestAccess: REQUEST_ACCESS,
}
