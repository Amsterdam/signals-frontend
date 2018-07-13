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
          field: 'description'
        },
        render: FormComponents.PlainText
      },
      extra_boten_snelheid_rondvaartboot: {
        meta: {
          cols: 6,
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
          cols: 6,
          label: 'Wat is de naam van de rederij? (niet verplicht)',
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
          updateIncident: true,
          watch: true
        },
        render: FormComponents.SelectInput
      },
      extra_boten_snelheid_naamboot: {
        meta: {
          cols: 6,
          label: 'Wat is de naam van de boot? (niet verplicht)',
          pathMerge: 'extra_properties',
          ifAllOf: {
            subcategory: 'Overlast op het water - snel varen'
          },
          watch: true
        },
        render: FormComponents.TextInput
      },
      extra_boten_geluid_meer: {
        meta: {
          label: 'Zijn er nog dingen die u ons nog meer kunt vertellen? (niet verplicht)',
          pathMerge: 'extra_properties',
          ifAllOf: {
            subcategory: 'Overlast op het water - geluid'
          },
          watch: true
        },
        render: FormComponents.TextareaInput
      },
      extra_boten_gezonken_meer: {
        meta: {
          label: 'Zijn er nog dingen die u ons nog meer kunt vertellen? (niet verplicht)',
          subtitle: 'Bijvoorbeeld: "er lekt olie", "gevaar voor andere boten", etc.',
          pathMerge: 'extra_properties',
          ifAllOf: {
            subcategory: 'Overlast op het water - Gezonken boot'
          },
          watch: true
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
