// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { AbstractControl } from 'react-reactive-form'

export const validatePhoneNumber = (control?: AbstractControl) => {
  if (
    !control ||
    control.value === '' ||
    control.value === undefined ||
    RegExp('^[ ()0-9+-]*$').test(control.value)
  ) {
    return null
  }

  return {
    custom:
      'Ongeldig telefoonnummer, alleen cijfers, spaties, haakjes, + en - zijn toegestaan.',
  }
}

export const createRequired = (message: string) =>
  function required({ value }: AbstractControl) {
    return value === null || value === undefined || value.length === 0
      ? { required: message }
      : null
  }

export const validateObjectLocation = (objectType: string) =>
  function required(control: AbstractControl) {
    if (control.value?.location?.coordinates) return null

    return {
      custom: `Kies een locatie of een ${objectType} op de kaart of vul een adres in`,
    }
  }
