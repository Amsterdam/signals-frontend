import rolesJson from 'utils/__tests__/fixtures/roles.json';

import formatRoles from '..';

describe('formatRoles service', () => {
  it('should format roles', () => {
    expect(formatRoles(rolesJson)).toEqual([
      {
        Naam: 'Behandelaar',
        Rechten: 'Leesrechten algemeen, Wijzigen van status van een melding, Melding aanmaken, Notitie toevoegen bij een melding, Splitsen van een melding, Schrijfrechten algemeen',
        id: 2,
      },
      {
        Naam: 'Coördinator',
        Rechten: 'Leesrechten algemeen, Wijzigen van categorie van een melding, Wijzigen van status van een melding, Melding aanmaken, Notitie toevoegen bij een melding, Splitsen van een melding, Schrijfrechten algemeen',
        id: 3,
      },
      {
        Naam: 'Extern Systeem',
        Rechten: 'Leesrechten algemeen, Wijzigen van status van een melding, Melding aanmaken, Notitie toevoegen bij een melding, Schrijfrechten algemeen',
        id: 20,
      },
      {
        Naam: 'Hele beperkte rol',
        Rechten: 'Wijzigen van status van een melding, Melding aanmaken',
        id: 30,
      },
      {
        Naam: 'Monitor',
        Rechten: 'Bekijk all categorieën (overschrijft categorie rechten van afdeling), Leesrechten algemeen, Melding aanmaken, Notitie toevoegen bij een melding, Schrijfrechten algemeen',
        id: 1,
      },
      {
        Naam: 'Nieuwe rollen, nieuwe kansen',
        Rechten: 'Can add note, Can add priority, Leesrechten algemeen, Melding aanmaken, Meldingen exporteren, Schrijfrechten algemeen, Doorsturen van een melding (THOR)',
        id: 26,
      },
      {
        Naam: 'Regievoerder',
        Rechten: 'Bekijk all categorieën (overschrijft categorie rechten van afdeling), Leesrechten algemeen, Wijzigen van categorie van een melding, Wijzigen van status van een melding, Melding aanmaken, Notitie toevoegen bij een melding, Splitsen van een melding, Schrijfrechten algemeen, Doorsturen van een melding (THOR)',
        id: 19,
      },
      {
        Naam: 'Regievoerder Plus',
        Rechten: 'Leesrechten algemeen, Wijzigen van categorie van een melding, Wijzigen van status van een melding, Melding aanmaken, Notitie toevoegen bij een melding, Meldingen exporteren, Rapportage beheren, Splitsen van een melding, Schrijfrechten algemeen, Doorsturen van een melding (THOR), Wijzingen van standaardteksten',
        id: 22,
      },
      {
        Naam: 'Test',
        Rechten: 'Notitie toevoegen bij een melding',
        id: 28,
      },
    ]);
  });
});
