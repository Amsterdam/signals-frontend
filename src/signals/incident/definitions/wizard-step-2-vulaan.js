import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Dit hebben we nog van u nodig',
  form: {
    controls: {
      custom_text: {
        meta: {
          label: 'Dit hebt u net ingevuld:',
          type: 'citation',
          value: '{incident.description}'
        },
        render: FormComponents.PlainText
      },


      extra_personen_overig: {
        meta: {
          className: 'col-sm-12 col-md-6',
          ifAllOf: {
            category: 'Overlast van en door personen of groepen'
          },
          label: 'Om hoe veel personen gaat het (ongeveer)?',
          pathMerge: 'extra_properties',
          values: {
            '1-3': '1 - 3',
            '4-6': '4 - 6',
            '7+': '7 of meer',
            '': 'Onbekend'
          }
        },
        render: FormComponents.RadioInput
      },
      extra_personen_overig_vaker: {
        meta: {
          className: 'col-sm-12 col-md-6',
          ifAllOf: {
            category: 'Overlast van en door personen of groepen'
          },
          label: 'Gebeurt het vaker?',
          pathMerge: 'extra_properties',
          value: 'Ja, het gebeurt vaker:',
          updateIncident: true
        },
        render: FormComponents.CheckboxInput
      },
      extra_personen_overig_vaker_momenten: {
        meta: {
          label: 'Geef aan op welke momenten het gebeurt',
          pathMerge: 'extra_properties',
          ifAllOf: {
            extra_personen_overig_vaker: true,
            category: 'Overlast van en door personen of groepen'
          }
        },
        render: FormComponents.TextareaInput
      },


      extra_bedrijven_binnenstad_text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          ifAllOf: {
            category: 'Overlast Bedrijven en Horeca'
          },
          type: 'caution',
          value: 'Gaat het om overlast in de binnenstad? Bel 14 020 en vul dit formulier niet verder in.  Dan kunnen we sneller voor u aan het werk.'
        },
        render: FormComponents.PlainText
      },
      extra_bedrijven_overig: {
        meta: {
          ifAllOf: {
            category: 'Overlast Bedrijven en Horeca'
          },
          label: 'Uw melding gaat over:',
          pathMerge: 'extra_properties',
          values: {
            Horecabedrijf: 'Horecabedrijf (café, restaurant, snackbar, etc.)',
            'Ander soort bedrijf': 'Ander soort bedrijf',
            Evenement: 'Evenement (festival, markt, etc.)',
            'Iets anders': 'Iets anders'
          }
        },
        render: FormComponents.RadioInput
      },
      extra_bedrijven_naam: {
        meta: {
          ifAllOf: {
            category: 'Overlast Bedrijven en Horeca'
          },
          label: 'Bedrijfsnaam / Evenementnaam van vermoedelijke veroorzaker',
          pathMerge: 'extra_properties'
        },
        render: FormComponents.TextInput
      },
      extra_bedrijven_adres: {
        meta: {
          ifAllOf: {
            category: 'Overlast Bedrijven en Horeca'
          },
          label: 'Op welke locatie ervaart u de overlast',
          pathMerge: 'extra_properties'
        },
        render: FormComponents.TextInput
      },
      extra_bedrijven_vaker: {
        meta: {
          ifAllOf: {
            category: 'Overlast Bedrijven en Horeca'
          },
          label: 'Gebeurt het vaker?',
          pathMerge: 'extra_properties',
          value: 'Ja, het gebeurt vaker:',
          updateIncident: true
        },
        render: FormComponents.CheckboxInput
      },
      extra_bedrijven_momenten: {
        meta: {
          label: 'Geef aan op welke momenten het gebeurt',
          pathMerge: 'extra_properties',
          ifAllOf: {
            extra_bedrijven_vaker: true,
            category: 'Overlast Bedrijven en Horeca'
          }
        },
        render: FormComponents.TextareaInput
      },
      extra_bedrijven_text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          ifAllOf: {
            category: 'Overlast Bedrijven en Horeca'
          },
          value: [
            'Onze handhavers willen graag contact kunnen opnemen over uw melding. Bijvoorbeeld om een afspraak te maken om bij u thuis een geluidsmeting te verrichten. Anonieme meldingen krijgen daarom een lage prioriteit.',
            'Uw gegevens worden vertrouwelijk behandeld en worden niet aan een (horeca)ondernemer bekend gemaakt.'
          ]
        },
        render: FormComponents.PlainText
      },


      extra_boten_snelheid_rondvaartboot: {
        meta: {
          className: 'col-sm-12 col-md-6',
          ifAllOf: {
            subcategory: 'Overlast op het water - snel varen'
          },
          label: 'Gaat de melding over een rondvaartboot?',
          pathMerge: 'extra_properties',
          values: {
            Ja: 'Ja',
            Nee: 'Nee'
          },
          updateIncident: true
        },
        render: FormComponents.RadioInput
      },
      extra_boten_snelheid_rederij: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Wat is de naam van de rederij?',
          subtitle: 'Als u begint met typen verschijnt vanzelf een lijst met rederijen',
          pathMerge: 'extra_properties',
          values: {
            Onbekend: 'Onbekend',
            'Admiraal Heijn': 'Admiraal Heijn',
            'Amsterdam Boat Center': 'Amsterdam Boat Center',
            'Amsterdam Boat Events': 'Amsterdam Boat Events',
            'Amsterdam Canal Cruises': 'Amsterdam Canal Cruises',
            'Amsterdamse Salonboot Rederij': 'Amsterdamse Salonboot Rederij',
            'Amsterdamse Watertaxi Centrale': 'Amsterdamse Watertaxi Centrale',
            Arviro: 'Arviro',
            'Atropa Belladonna': 'Atropa Belladonna',
            'Avontuur Amsterdam': 'Avontuur Amsterdam',
            'Blue Boat Company': 'Blue Boat Company',
            'Bughouse Tours Amsterdam': 'Bughouse Tours Amsterdam',
            'Canal Bus': 'Canal Bus',
            'Canal Company': 'Canal Company',
            'Canal Rondvaart': 'Canal Rondvaart',
            'Classic Boat Dinners': 'Classic Boat Dinners',
            'Classic Ship Service': 'Classic Ship Service',
            Edutech: 'Edutech',
            'Hollandsche Vaartochten Mij.': 'Hollandsche Vaartochten Mij.',
            Leemstar: 'Leemstar',
            'Meijers Rondvaarten': 'Meijers Rondvaarten',
            'Meinema, W.D.': 'Meinema, W.D.',
            MokumBoot: 'MokumBoot',
            'Nationale Vereniging de Zonnebloem': 'Nationale Vereniging de Zonnebloem',
            'New Orange': 'New Orange',
            'Paradis Private Boat Tours': 'Paradis Private Boat Tours',
            'Rederij Aemstelland': 'Rederij Aemstelland',
            'Rederij Amsterdam': 'Rederij Amsterdam',
            'Rederij Belle': 'Rederij Belle',
            'Rederij Cruise With Us': 'Rederij Cruise With Us',
            'Rederij De Jordaan': 'Rederij De Jordaan',
            'Rederij de Nederlanden': 'Rederij de Nederlanden',
            'Rederij Friendship': 'Rederij Friendship',
            'Rederij Griffioen': 'Rederij Griffioen',
            'Rederij Gypsy Ballad': 'Rederij Gypsy Ballad',
            'Rederij Kooij': 'Rederij Kooij',
            'Rederij Leemstar': 'Rederij Leemstar',
            'Rederij Lieve': 'Rederij Lieve',
            'Rederij Lovers': 'Rederij Lovers',
            'Rederij Nassau': 'Rederij Nassau',
            'Rederij Plas': 'Rederij Plas',
            'Rederij \'t Smidtje': 'Rederij \'t Smidtje',
            'Rederij Vlaun': 'Rederij Vlaun',
            'Rederij Welvaren': 'Rederij Welvaren',
            'Salonboot Adeline': 'Salonboot Adeline',
            'Salonboot Belle van Zuylen': 'Salonboot Belle van Zuylen',
            'Salonboot Dame van Amstel': 'Salonboot Dame van Amstel',
            'Salonboot Hilda': 'Salonboot Hilda',
            'Scheepsbouw Achterbos Theo Kok': 'Scheepsbouw Achterbos Theo Kok',
            'Shoulders Sloepen': 'Shoulders Sloepen',
            'Smidtje Beheer': 'Smidtje Beheer',
            'Smidtje Exploitatie': 'Smidtje Exploitatie',
            'Smidtje Holding': 'Smidtje Holding',
            SOP: 'SOP',
            'Stichting behoud Salonboot Avanti': 'Stichting behoud Salonboot Avanti',
            'Stichting Cordaan Groep': 'Stichting Cordaan Groep',
            'Stichting De Kalefater': 'Stichting De Kalefater',
            'Stichting Motorschip Jonckvrouw': 'Stichting Motorschip Jonckvrouw',
            'Ver. Vrienden van de Boonapanich': 'Ver. Vrienden van de Boonapanich',
            'Ver.van Vrienden van de Britannia': 'Ver.van Vrienden van de Britannia',
            'Waterlelie Rondvaart': 'Waterlelie Rondvaart',
            'Windkracht 18': 'Windkracht 18',
            Wolfsburght: 'Wolfsburght',
            'Zonneboot Amsterdam': 'Zonneboot Amsterdam'
          },
          ifAllOf: {
            subcategory: 'Overlast op het water - snel varen',
            extra_boten_snelheid_rondvaartboot: 'Ja'
          },
          updateIncident: true
        },
        render: FormComponents.SelectInput
      },
      extra_boten_snelheid_naamboot: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Wat is de naam van de boot?',
          pathMerge: 'extra_properties',
          ifAllOf: {
            subcategory: 'Overlast op het water - snel varen'
          }
        },
        render: FormComponents.TextInput
      },
      extra_boten_snelheid_meer: {
        meta: {
          label: 'Zijn er nog dingen die u ons nog meer kunt vertellen?',
          subtitle: 'Bijvoorbeeld: de kleur(en) van de boot, het aantal passagiers, de vaarrichting, Y of Vignet nummer etc.',
          pathMerge: 'extra_properties',
          ifAllOf: {
            subcategory: 'Overlast op het water - snel varen'
          }
        },
        render: FormComponents.TextareaInput
      },
      extra_boten_geluid_meer: {
        meta: {
          label: 'Zijn er nog dingen die u ons nog meer kunt vertellen?',
          pathMerge: 'extra_properties',
          ifAllOf: {
            subcategory: 'Overlast op het water - geluid'
          }
        },
        render: FormComponents.TextareaInput
      },
      extra_boten_gezonken_meer: {
        meta: {
          label: 'Zijn er nog dingen die u ons nog meer kunt vertellen?',
          subtitle: 'Bijvoorbeeld: "er lekt olie", "gevaar voor andere boten", etc.',
          pathMerge: 'extra_properties',
          ifAllOf: {
            subcategory: 'Overlast op het water - Gezonken boot'
          }
        },
        render: FormComponents.TextareaInput
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation
      }
    }
  }
};
