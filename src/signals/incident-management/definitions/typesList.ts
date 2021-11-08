// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

enum TypeKey {
  SIG = 'SIG',
  REQ = 'REQ',
  QUE = 'QUE',
  COM = 'COM',
  MAI = 'MAI',
}

export type Type = {
  key: TypeKey
  value: string
  info: string
}

export default [
  {
    key: TypeKey.SIG,
    value: 'Melding',
    info: 'Een verzoek tot herstel of handhaving om de normale situatie te herstellen (container vol, geluidsoverlast, te hard varen, etc).',
  },
  {
    key: TypeKey.REQ,
    value: 'Aanvraag',
    info: 'Een verzoek om iets structureels te veranderen (plaatsing bankje, verplaatsen container, etc).',
  },
  {
    key: TypeKey.QUE,
    value: 'Vraag',
    info: 'Een verzoek om informatie (van wie is die camera, waarom zijn de paaltjes weggehaald, etc).',
  },
  {
    key: TypeKey.COM,
    value: 'Klacht',
    info: 'Een uiting van ongenoegen over het handelen van de gemeente.',
  },
  {
    key: TypeKey.MAI,
    value: configuration.featureFlags.useProjectenSignalType
      ? 'Projecten'
      : 'Groot onderhoud',
    info: configuration.featureFlags.useProjectenSignalType
      ? 'Een verzoek dat niet onder dagelijks beheer valt, maar onder een project.'
      : 'Een verzoek dat niet onder dagelijks beheer valt, maar onder een langdurig traject.',
  },
]
