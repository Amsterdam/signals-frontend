import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

const intro = {
  custom_text: {
    meta: {
      label: 'Dit hebt u net ingevuld:',
      type: 'citation',
      value: '{incident.description}',
      ignoreVisibility: true,
    },
    render: FormComponents.PlainText,
  },
};

export const controls = {
  extra_boten_snelheid_rondvaartboot: {
    meta: {
      ifAllOf: {
        subcategory: 'overlast-op-het-water-snel-varen',
      },
      label: 'Gaat de melding over een rondvaartboot?',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_boten_snelheid_rederij: {
    meta: {
      label: 'Wat is de naam van de rederij?',
      shortLabel: 'Rederij',
      subtitle: 'Als u begint met typen verschijnt vanzelf een lijst met rederijen',
      pathMerge: 'extra_properties',
      values: {
        onbekend: 'Onbekend',
        admiraal_heijn: 'Admiraal Heijn',
        amsterdam_boat_center: 'Amsterdam Boat Center',
        amsterdam_boat_events: 'Amsterdam Boat Events',
        amsterdam_canal_cruises: 'Amsterdam Canal Cruises',
        amsterdamse_salonboot_rederij: 'Amsterdamse Salonboot Rederij',
        amsterdamse_watertaxi_centrale: 'Amsterdamse Watertaxi Centrale',
        arviro: 'Arviro',
        atropa_belladonna: 'Atropa Belladonna',
        avontuur_amsterdam: 'Avontuur Amsterdam',
        blue_boat_company: 'Blue Boat Company',
        bughouse_tours_amsterdam: 'Bughouse Tours Amsterdam',
        canal_bus: 'Canal Bus',
        canal_company: 'Canal Company',
        canal_rondvaart: 'Canal Rondvaart',
        classic_boat_dinners: 'Classic Boat Dinners',
        classicship_service: 'Classic Ship Service',
        edutech: 'Edutech',
        hollandsche_vaartochten_mij: 'Hollandsche Vaartochten Mij.',
        leemstar: 'Leemstar',
        meijers_rondvaarten: 'Meijers Rondvaarten',
        meinema_wd: 'Meinema, W.D.',
        mokumBoot: 'MokumBoot',
        nationale_vereniging_de_zonnebloem: 'Nationale Vereniging de Zonnebloem',
        new_orange: 'New Orange',
        paradis_private_boat_tours: 'Paradis Private Boat Tours',
        rederij_aemstelland: 'Rederij Aemstelland',
        rederij_amsterdam: 'Rederij Amsterdam',
        rederij_belle: 'Rederij Belle',
        rederij_cruise_with_us: 'Rederij Cruise With Us',
        rederij_de_jordaan: 'Rederij De Jordaan',
        rederij_de_nederlanden: 'Rederij de Nederlanden',
        rederij_friendship: 'Rederij Friendship',
        rederij_griffioen: 'Rederij Griffioen',
        rederij_gypsy_ballad: 'Rederij Gypsy Ballad',
        rederij_kooij: 'Rederij Kooij',
        rederij_leemstar: 'Rederij Leemstar',
        rederij_lieve: 'Rederij Lieve',
        rederij_lovers: 'Rederij Lovers',
        rederij_nassau: 'Rederij Nassau',
        rederij_plas: 'Rederij Plas',
        rederij_t_smidtje: "Rederij 't Smidtje",
        rederij_vlaun: 'Rederij Vlaun',
        rederij_welvaren: 'Rederij Welvaren',
        salonboot_adeline: 'Salonboot Adeline',
        salonboot_belle_van_zuylen: 'Salonboot Belle van Zuylen',
        salonboot_dame_van_amstel: 'Salonboot Dame van Amstel',
        salonboot_hilda: 'Salonboot Hilda',
        scheepsbouw_achterbos_theo_kok: 'Scheepsbouw Achterbos Theo Kok',
        shoulders_sloepen: 'Shoulders Sloepen',
        smidtje_beheer: 'Smidtje Beheer',
        smidtje_exploitatie: 'Smidtje Exploitatie',
        smidtje_holding: 'Smidtje Holding',
        sop: 'SOP',
        stichting_behoud_salonboot_avanti: 'Stichting behoud Salonboot Avanti',
        stichting_cordaan_groep: 'Stichting Cordaan Groep',
        stichting_de_kalefater: 'Stichting De Kalefater',
        stichting_motorschip_jonckvrouw: 'Stichting Motorschip Jonckvrouw',
        ver_Vrienden_van_de_boonapanich: 'Ver. Vrienden van de Boonapanich',
        ver_van_vrienden_van_de_britannia: 'Ver.van Vrienden van de Britannia',
        waterlelie_rondvaart: 'Waterlelie Rondvaart',
        windkracht_18: 'Windkracht 18',
        wolfsburght: 'Wolfsburght',
        zonneboot_amsterdam: 'Zonneboot Amsterdam',
      },
      ifAllOf: {
        subcategory: 'overlast-op-het-water-snel-varen',
        extra_boten_snelheid_rondvaartboot: 'ja',
      },
    },
    render: FormComponents.SelectInput,
  },
  extra_boten_snelheid_naamboot: {
    meta: {
      label: 'Wat is de naam van de boot?',
      shortLabel: 'Naam boot',
      pathMerge: 'extra_properties',
      ifAllOf: {
        subcategory: 'overlast-op-het-water-snel-varen',
      },
    },
    render: FormComponents.TextInput,
  },
  extra_boten_snelheid_meer: {
    meta: {
      label: 'Zijn er nog meer dingen die u ons kunt vertellen over deze situatie?',
      shortLabel: 'Extra informatie',
      subtitle:
        'Bijvoorbeeld: de kleur(en) van de boot, het aantal passagiers, de vaarrichting, Y of Vignet nummer etc.',
      pathMerge: 'extra_properties',
      ifAllOf: {
        subcategory: 'overlast-op-het-water-snel-varen',
      },
    },
    render: FormComponents.TextareaInput,
  },
  extra_boten_geluid_meer: {
    meta: {
      label: 'Zijn er nog meer dingen die u ons kunt vertellen over deze situatie',
      shortLabel: 'Extra informatie',
      subtitle:
        'Bijvoorbeeld: waar de boot naar toe vaart, kleur van de boot, aantal passagiers, kenteken, vignet, etc.',
      pathMerge: 'extra_properties',
      ifAllOf: {
        subcategory: 'overlast-op-het-water-geluid',
      },
    },
    render: FormComponents.TextareaInput,
  },
  extra_boten_gezonken_meer: {
    meta: {
      label: 'Zijn er nog meer dingen die u ons kunt vertellen over deze situatie?',
      shortLabel: 'Extra informatie',
      subtitle: 'Bijvoorbeeld: "er lekt olie", "gevaar voor andere boten", etc.',
      pathMerge: 'extra_properties',
      ifAllOf: {
        subcategory: 'overlast-op-het-water-gezonken-boot',
      },
    },
    render: FormComponents.TextareaInput,
  },
};

const navigation = {
  $field_0: {
    isStatic: false,
    render: IncidentNavigation,
  },
};

export default {
  controls: {
    ...intro,

    ...controls,

    ...navigation,
  },
};
