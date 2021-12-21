// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants'

import appConfiguration from 'shared/services/configuration/configuration'
import type { IconOptions } from 'leaflet'
import {
  selectIcon,
  unknownIcon,
} from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/AssetLayer/MarkerIcons'
import type ConfigurationType from '../../../../../app.amsterdam.json'
import * as verlichtingIcons from './verlichting-icons'

export const ICON_SIZE = 40

const options: Pick<IconOptions, 'className' | 'iconSize'> = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
}

const configuration = appConfiguration as unknown as typeof ConfigurationType

export const wegenVerkeerStraatmeubilair = {
  // This element will be enabled each year near the christmass.
  // Comment/Uncomment next block to show/hide it.
  extra_kerstverlichting: {
    meta: {
      type: 'alert-inverted',
      value:
        'Doet de sierverlichting in een winkelstraat het niet? Of hebt u last van de kerstverlichting? Neem dan contact op met de winkeliersvereniging. De gemeente gaat hier helaas niet over.',
      ifAllOf: {
        subcategory: 'lantaarnpaal-straatverlichting',
      },
    },
    render: FIELD_TYPE_MAP.plain_text,
  },

  extra_onderhoud_stoep_straat_en_fietspad: {
    meta: {
      ifOneOf: {
        subcategory: ['onderhoud-stoep-straat-en-fietspad', 'gladheid'],
      },
      label: 'Om wat voor soort wegdek gaat het?',
      shortLabel: 'Soort wegdek',
      subtitle: 'Bijvoorbeeld: asfalt, klinkers of stoeptegels',
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.text_input,
  },
  extra_wegen_gladheid: {
    meta: {
      ifAllOf: {
        subcategory: 'gladheid',
      },
      type: 'caution',
      value: `
Let op:

Is het glad bij een trein-, bus- of metrostation? Neem dan contact op met de NS of GVB: [gvb.nl/klantenservice](https://gvb.nl/klantenservice)`,
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_straatverlichting_probleem: {
    meta: {
      label: 'Wat is het probleem?',
      shortLabel: 'Probleem',
      ifAllOf: {
        subcategory: 'lantaarnpaal-straatverlichting',
      },
      values: {
        lamp_doet_het_niet: 'Lamp doet het niet',
        lamp_brandt_overdag:
          'Lamp brandt overdag, langer dan 2 dagen achter elkaar',
        geeft_lichthinder:
          'Lamp geeft lichthinder (schijnt bijvoorbeeld in slaapkamer)',
        lamp_is_zichtbaar_beschadigd:
          'Lamp of lantaarnpaal is beschadigd of niet compleet',
        overig: 'Overig',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_straatverlichting: {
    meta: {
      label: 'Denkt u dat de situatie gevaarlijk is?',
      shortLabel: 'Denkt u dat de situatie gevaarlijk is?',
      ifAllOf: {
        subcategory: 'lantaarnpaal-straatverlichting',
      },
      ifOneOf: {
        extra_straatverlichting_probleem: [
          'lamp_doet_het_niet',
          'lamp_is_zichtbaar_beschadigd',
          'overig',
        ],
      },
      values: {
        drie_of_meer_kapot: 'Ja, 3 of meer lampen in de straat zijn kapot',
        is_gevolg_van_aanrijding: 'Ja, het is een gevolg van een aanrijding',
        lamp_op_grond_of_scheef:
          'Ja, de lamp of lantaarnpaal ligt op de grond of staat gevaarlijk scheef',
        deurtje_weg_of_open:
          'Ja, er zit geen deurtje in de lantaarnpaal of het deurtje staat open',
        losse_kabels_zichtbaar_of_lamp_los:
          'Ja, er hangen losse stroomkabels of de lamp hangt los',
        niet_gevaarlijk: 'Nee, niet gevaarlijk',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_straatverlichting_drie_of_meer_message: {
    meta: {
      ifOneOf: {
        extra_straatverlichting: 'drie_of_meer_kapot',
      },
      type: 'info',
      value:
        'Let op: u hoeft maar 1 lamp of lantaarnpaal aan te klikken. Het is niet nodig alle kapotte lampen of lantaarnpalen aan te klikken.',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_straatverlichting_gevaar: {
    meta: {
      ifAllOf: {
        subcategory: 'lantaarnpaal-straatverlichting',
        ifOneOf: {
          extra_straatverlichting_probleem: [
            'lamp_doet_het_niet',
            'lamp_is_zichtbaar_beschadigd',
            'overig',
          ],
        },
      },
      ifOneOf: {
        extra_straatverlichting: [
          'drie_of_meer_kapot',
          'is_gevolg_van_aanrijding',
          'lamp_op_grond_of_scheef',
          'deurtje_weg_of_open',
          'losse_kabels_zichtbaar_of_lamp_los',
        ],
      },
      type: 'alert',
      value: `Bel direct ${configuration.language.phoneNumber}. U hoeft dit formulier niet meer verder in te vullen.`,
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_straatverlichting_nummer: {
    meta: {
      language: {
        title: 'Locatie',
        subTitle: 'Kies het lichtpunt op de kaart',
        unregistered: 'Het lichtpunt staat niet op de kaart',
        unregisteredId: 'Nummer van het lichtpunt',
        objectTypeSingular: 'lichtpunt',
        objectTypePlural: 'lichtpunten',
        submit: 'Gebruik deze locatie',
      },
      label: 'Waar is het?',
      shortLabel: 'Lichtpunt(en) op kaart',
      ifAllOf: {
        subcategory: 'lantaarnpaal-straatverlichting',
      },
      ifOneOf: {
        extra_straatverlichting_probleem: [
          'lamp_doet_het_niet',
          'lamp_brandt_overdag',
          'geeft_lichthinder',
          'lamp_is_zichtbaar_beschadigd',
          'overig',
        ],
      },
      wfsFilter:
        '<BBOX><gml:Envelope srsName="{srsName}"><lowerCorner>{west} {south}</lowerCorner><upperCorner>{east} {north}</upperCorner></gml:Envelope></BBOX>',
      endpoint: configuration.map.layers?.klokken,
      featureTypes: [
        {
          label: 'Grachtmast',
          description: 'Grachtmast',
          icon: {
            options,
            iconSvg: verlichtingIcons.grachtmast,
            selectedIconSvg: selectIcon,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: '5',
        },
        {
          label: 'Overspanning',
          description: 'Overspanning',
          icon: {
            options,
            iconSvg: verlichtingIcons.overspanning,
            selectedIconSvg: selectIcon,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: '2',
        },
        {
          label: 'Gevelarmatuur',
          description: 'Gevelarmatuur',
          icon: {
            options,
            iconSvg: verlichtingIcons.gevel_armatuur,
            selectedIconSvg: selectIcon,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: '3',
        },
        {
          label: 'Schijnwerper',
          description: 'Schijnwerper',
          icon: {
            options,
            iconSvg: verlichtingIcons.schijnwerper,
            selectedIconSvg: selectIcon,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: '10',
        },
        {
          label: 'Overig lichtpunt',
          description: 'Overig lichtpunt',
          icon: {
            options,
            iconSvg: verlichtingIcons.overig_lichtpunt,
            selectedIconSvg: selectIcon,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: '4',
        },
        {
          label: 'Is gemeld',
          description: 'Is gemeld',
          icon: {
            options,
            iconSvg: verlichtingIcons.reported,
            selectedIconSvg: verlichtingIcons.reported,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: 'reported',
        },
        {
          description: 'Het lichtpunt staat niet op de kaart',
          label: 'Onbekend',
          icon: {
            iconSvg: unknownIcon,
            selectedIconSvg: selectIcon,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'not-on-map',
        },
      ],
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.streetlight_select,
  },
  extra_straatverlichting_niet_op_kaart_nummer: {
    meta: {
      label: 'Wat is het nummer op de lamp of lantaarnpaal?',
      shortLabel: 'Lichtpunt(en) niet op kaart',
      pathMerge: 'extra_properties',
      placeholder: 'Nummer lichtpunt',
      newItemText: '+ Voeg een extra nummer toe',
      ifAllOf: {
        extra_straatverlichting_niet_op_kaart: true,
        subcategory: 'lantaarnpaal-straatverlichting',
      },
      ifOneOf: {
        extra_straatverlichting_probleem: [
          'lamp_doet_het_niet',
          'lamp_brandt_overdag',
          'geeft_lichthinder',
          'lamp_is_zichtbaar_beschadigd',
          'overig',
        ],
      },
    },
    render: FIELD_TYPE_MAP.multi_text_input,
  },

  extra_klok: {
    meta: {
      label: 'Denkt u dat de situatie gevaarlijk is?',
      shortLabel: 'Denkt u dat de situatie gevaarlijk is?',
      ifAllOf: {
        subcategory: 'klok',
      },
      values: {
        is_gevolg_van_aanrijding: 'Het is het gevolg van een aanrijding',
        klok_op_grond_of_scheef:
          'Klok ligt op de grond of staat gevaarlijk scheef',
        deurtje_weg_of_open:
          'Deurtje in de mast is niet aanwezig of staat open',
        losse_kabels_zichtbaar_of_lamp_los:
          'Er zijn losse electriciteitskabels zichtbaar of er hangt een lamp los',
        niet_gevaarlijk: 'Niet gevaarlijk',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_klok_gevaar: {
    meta: {
      ifAllOf: {
        subcategory: 'klok',
      },
      ifOneOf: {
        extra_klok: [
          'is_gevolg_van_aanrijding',
          'klok_op_grond_of_scheef',
          'deurtje_weg_of_open',
          'losse_kabels_zichtbaar_of_lamp_los',
        ],
      },
      type: 'alert',
      value: `Bel direct ${configuration.language.phoneNumber}. U hoeft dit formulier niet meer verder in te vullen.`,
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_klok_probleem: {
    meta: {
      label: 'Wat is het probleem?',
      shortLabel: 'Probleem',
      ifAllOf: {
        subcategory: 'klok',
      },
      ifOneOf: {
        extra_klok: [
          'is_gevolg_van_aanrijding',
          'klok_op_grond_of_scheef',
          'deurtje_weg_of_open',
          'losse_kabels_zichtbaar_of_lamp_los',
          'niet_gevaarlijk',
        ],
      },
      values: {
        klok_staat_niet_op_tijd_of_stil:
          'Klok staat niet op tijd of staat stil',
        klok_is_zichtbaar_beschadigd: 'Klok is zichtbaar beschadigd',
        overig: 'Overig',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_klok_nummer: {
    meta: {
      language: {
        title: 'Locatie',
        subTitle: 'Kies de klok op de kaart',
        unregistered: 'De klok staat niet op de kaart',
        unregisteredId: 'Nummer van de klok',
        objectTypeSingular: 'klok',
        objectTypePlural: 'klokken',
        submit: 'Gebruik deze locatie',
      },
      label: 'Waar is het?',
      shortLabel: 'Klok(ken) op kaart',
      ifAllOf: {
        subcategory: 'klok',
      },
      ifOneOf: {
        extra_klok_probleem: [
          'klok_staat_niet_op_tijd_of_stil',
          'klok_is_zichtbaar_beschadigd',
          'overig',
        ],
      },
      wfsFilter:
        '<BBOX><gml:Envelope srsName="{srsName}"><lowerCorner>{west} {south}</lowerCorner><upperCorner>{east} {north}</upperCorner></gml:Envelope></BBOX>',
      endpoint: configuration.map.layers?.verlichting,
      zoomMin: 14,
      featureTypes: [
        {
          label: 'Klok',
          description: 'Klok',
          icon: {
            options,
            iconSvg: verlichtingIcons.klok,
            selectedIconSvg: selectIcon,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: '1',
        },
        {
          label: 'Is gemeld',
          description: 'Is gemeld',
          icon: {
            options,
            iconSvg: verlichtingIcons.reported,
            selectedIconSvg: verlichtingIcons.reported,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: 'reported',
        },
        {
          description: 'De klok staat niet op de kaart',
          label: 'Onbekend',
          icon: {
            iconSvg: unknownIcon,
            selectedIconSvg: selectIcon,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'not-on-map',
        },
      ],
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.clock_select,
  },
  extra_klok_niet_op_kaart_nummer: {
    meta: {
      label: 'Wat is het nummer dat op de klok staat?',
      shortLabel: 'Klok(ken) niet op kaart',
      pathMerge: 'extra_properties',
      placeholder: 'Nummer klok',
      ifAllOf: {
        extra_klok_niet_op_kaart: true,
        subcategory: 'klok',
      },
      newItemText: '+ Voeg een extra nummer toe',
      ifOneOf: {
        extra_klok_probleem: [
          'klok_staat_niet_op_tijd_of_stil',
          'klok_is_zichtbaar_beschadigd',
          'overig',
        ],
      },
    },
    render: FIELD_TYPE_MAP.multi_text_input,
  },
  extra_verkeerslicht_welk: {
    meta: {
      label: 'Welk verkeerslicht werkt niet goed?',
      shortLabel: 'Type verkeerslicht',
      ifAllOf: {
        subcategory: 'verkeerslicht',
      },
      values: {
        voetganger: 'Voetganger',
        fiets: 'Fiets',
        auto: 'Auto',
        tram_bus: 'Tram of bus',
        niet_van_toepassing: 'Niet van toepassing',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_verkeerslicht: {
    meta: {
      label: 'Zijn er ook beschadigingen aan het verkeerslicht?',
      shortLabel: 'Beschadigingen aan verkeerslicht',
      ifAllOf: {
        subcategory: 'verkeerslicht',
      },
      ifOneOf: {
        extra_verkeerslicht_welk: ['voetganger', 'fiets', 'auto', 'tram_bus'],
      },
      values: {
        geen_beschadigingen: 'Nee, geen beschadigingen',
        verkeerslicht_scheef: 'Ja, het verkeerslicht staat scheef',
        verkeerslicht_op_grond:
          'Ja, de lamp of het verkeerslicht ligt op de grond',
        lamp_hangt_los: 'Ja, de lamp hangt los',
        losse_kabels_zichtbaar: 'Ja, er hangen losse stroomkabels',
        deurtje_weg_of_open:
          'Ja, er zit geen deurtje in het verkeerslicht of het deurtje staat open',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_verkeerslicht_gevaar: {
    meta: {
      ifAllOf: {
        subcategory: 'verkeerslicht',
      },
      ifOneOf: {
        extra_verkeerslicht: [
          'verkeerslicht_scheef',
          'verkeerslicht_op_grond',
          'deurtje_weg_of_open',
          'losse_kabels_zichtbaar',
          'lamp_hangt_los',
        ],
      },
      label: `Dit kan een gevaarlijke situatie zijn, bel ${configuration.language.phoneNumber}`,
      type: 'info',
      value: `Wij verzoeken u om ons te bellen op ${configuration.language.phoneNumber} zodat we dit met spoed kunnen oppakken. U hoeft het formulier niet meer verder in te vullen.`,
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_verkeerslicht_probleem_voetganger: {
    meta: {
      label: 'Wat is het probleem?',
      shortLabel: 'Probleem',
      ifAllOf: {
        subcategory: 'verkeerslicht',
        extra_verkeerslicht: 'geen_beschadigingen',
        extra_verkeerslicht_welk: 'voetganger',
      },
      ifOneOf: {
        extra_verkeerslicht_welk: ['voetganger'],
      },
      values: {
        rood_werkt_niet: 'Rood licht werkt niet',
        groen_werkt_niet: 'Groen licht werkt niet',
        blindentikker_werkt_niet: 'Blindentikker werkt niet',
        groen_duurt_te_lang: 'Duurt (te) lang voordat het groen wordt',
        anders: 'Anders',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.checkbox_input,
  },
  extra_verkeerslicht_probleem_fiets_auto: {
    meta: {
      label: 'Wat is het probleem?',
      shortLabel: 'Probleem',
      ifAllOf: {
        subcategory: 'verkeerslicht',
        extra_verkeerslicht: 'geen_beschadigingen',
      },
      ifOneOf: {
        extra_verkeerslicht_welk: ['fiets', 'auto'],
      },
      values: {
        rood_werkt_niet: 'Rood licht werkt niet',
        oranje_werkt_niet: 'Oranje/geel licht werkt niet',
        groen_werkt_niet: 'Groen licht werkt niet',
        groen_duurt_te_lang: 'Duurt (te) lang voordat het groen wordt',
        anders: 'Anders',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.checkbox_input,
  },
  extra_verkeerslicht_probleem_bus_tram: {
    meta: {
      label: 'Wat is het probleem?',
      shortLabel: 'Probleem',
      ifAllOf: {
        subcategory: 'verkeerslicht',
        extra_verkeerslicht: 'geen_beschadigingen',
        extra_verkeerslicht_welk: 'tram_bus',
      },
      values: {
        rood_werkt_niet: 'Rood licht werkt niet',
        oranje_werkt_niet: 'Oranje/geel licht werkt niet',
        wit_werkt_niet: 'Wit licht werkt niet',
        waarschuwingslicht_tram_werkt_niet:
          'Licht dat waarschuwt voor aankomende tram werkt niet',
        anders: 'Anders',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.checkbox_input,
  },
  extra_verkeerslicht_nummer: {
    meta: {
      label: 'Wat is het nummer van het verkeerslicht?',
      shortLabel: 'Verkeerslicht nummer',
      subtitle:
        'Deze kunt u meestal vinden in witte tekst onder of boven de lampen',
      pathMerge: 'extra_properties',
      ifAllOf: {
        subcategory: 'verkeerslicht',
        extra_verkeerslicht: 'geen_beschadigingen',
      },
    },
    render: FIELD_TYPE_MAP.text_input,
  },

  extra_fietsrek_aanvragen: {
    meta: {
      ifAllOf: {
        subcategory: 'fietsrek-nietje',
      },
      label: "Wilt u een nieuw fietsenrek of 'nietje' aanvragen?",
      shortLabel: 'Fietsenrek aanvragen',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, dat ik wil ik',
        nee: 'Nee, ik wil direct verder gaan',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_fietsrek_aanvraag: {
    meta: {
      ifAllOf: {
        subcategory: 'fietsrek-nietje',
        extra_fietsrek_aanvragen: 'ja',
      },
      label: "Fietsenrek of 'nietje' aanvragen",
      shortLabel: "Aanvraag fietsenrek of 'nietje'",
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.textarea_input,
  },
}

export default wegenVerkeerStraatmeubilair
