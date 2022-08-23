// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam

type Control = {
  value: any
}

export const validatePhoneNumber = (control?: Control) => {
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

export const nullOrNumber = (message = 'Dit is een verplicht veld') =>
  function required(control: Control) {
    if (
      !control ||
      typeof control.value === 'number' ||
      control.value === null
    ) {
      return null
    }

    return {
      required: message,
    }
  }

export const validateObjectLocation = (objectType: string) =>
  function required(control: Control) {
    if (
      control.value?.location?.coordinates?.lng &&
      control.value?.location?.coordinates?.lat
    )
      return null

    return {
      custom: `Kies een locatie of een ${objectType} op de kaart of vul een adres in`,
    }
  }
