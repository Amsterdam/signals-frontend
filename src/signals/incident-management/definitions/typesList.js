// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration';

export default [
  {
    key: 'SIG',
    value: 'Melding',
    info:
      'Een verzoek tot herstel of handhaving om de normale situatie te herstellen (container vol, geluidsoverlast, te hard varen, etc).',
  },
  {
    key: 'REQ',
    value: 'Aanvraag',
    info: 'Een verzoek om iets structureels te veranderen (plaatsing bankje, verplaatsen container, etc).',
  },
  {
    key: 'QUE',
    value: 'Vraag',
    info: 'Een verzoek om informatie (van wie is die camera, waarom zijn de paaltjes weggehaald, etc).',
  },
  { key: 'COM', value: 'Klacht', info: 'Een uiting van ongenoegen over het handelen van de gemeente.' },
  {
    key: 'MAI',
    value: configuration.featureFlags.useProjectenSignalType ? 'Projecten' : 'Groot onderhoud',
    info: configuration.featureFlags.useProjectenSignalType
      ? 'Een verzoek dat niet onder dagelijks beheer valt, maar onder een project.'
      : 'Een verzoek dat niet onder dagelijks beheer valt, maar onder een langdurig traject.',
  },
];
