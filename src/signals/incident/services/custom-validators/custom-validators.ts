// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
type Control<T> = {
  value: T
}

export const validatePhoneNumber = (control?: Control<any>) => {
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

export const falsyOrNumber = (control: Control<any>) => {
  if (typeof control.value === 'number') {
    return null
  }
  return {
    custom: 'Dit is een verplicht veld',
  }
}

export const inPast = (control: Control<number>) => {
  const newDate = new Date()

  if (!control || !control.value || control.value <= newDate.getTime())
    return null
  return {
    custom: `Maak een melding aan met een tijdstip in het verleden`,
  }
}

export const validateObjectLocation = (objectType: string) =>
  function required(control: Control<any>) {
    if (
      control.value?.location?.coordinates?.lng &&
      control.value?.location?.coordinates?.lat
    )
      return null

    return {
      custom: `Kies een locatie of een ${objectType} op de kaart of vul een adres in`,
    }
  }
