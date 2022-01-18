// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants'

import appConfiguration from 'shared/services/configuration/configuration'
import type { IconOptions } from 'leaflet'

import gevelarmatuurUrl from 'shared/images/openbare_verlichting/gevelarmatuur.svg?url'
import grachtmastUrl from 'shared/images/openbare_verlichting/grachtmast.svg?url'
import overspanningUrl from 'shared/images/openbare_verlichting/overspanning.svg?url'
import klokUrl from 'shared/images/openbare_verlichting/klok.svg?url'
import overigUrl from 'shared/images/openbare_verlichting/overig.svg?url'
import reportedFeatureMarkerUrl from 'shared/images/icon-reported-marker.svg?url'
import schijnwerperUrl from 'shared/images/openbare_verlichting/schijnwerper.svg?url'
import unknownFeatureMarkerUrl from 'shared/images/featureUnknownMarker.svg?url'

import type ConfigurationType from '../../../../../app.amsterdam.json'
import { validateObjectLocation } from '../../services/custom-validators'

export const ICON_SIZE = 40

const options: Pick<IconOptions, 'className' | 'iconSize'> = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
}

const configuration = appConfiguration as unknown as typeof ConfigurationType

const straatverlichtingKlokken = {
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

  extra_straatverlichting_nummer: {
    meta: {
      language: {
        title: 'Locatie',
        subTitle: 'Kies een lichtpunt op de kaart',
        unregistered: 'Het lichtpunt staat niet op de kaart',
        unregisteredId: 'Nummer van het lichtpunt',
        objectTypeSingular: 'lichtpunt',
        objectTypePlural: 'lichtpunten',
        submit: 'Gebruik deze locatie',
      },
      label: 'Kies de lamp of lantaarnpaal waar het om gaat',
      shortLabel: 'Lichtpunt(en) op kaart',
      ifAllOf: {
        subcategory: 'lantaarnpaal-straatverlichting',
      },
      wfsFilter:
        '<PropertyIsNotEqualTo><ValueReference>objecttype_omschrijving</ValueReference><Literal>Klok</Literal></PropertyIsNotEqualTo><BBOX><gml:Envelope srsName="{srsName}"><lowerCorner>{west} {south}</lowerCorner><upperCorner>{east} {north}</upperCorner></gml:Envelope></BBOX>',
      endpoint: configuration.map.layers?.verlichting,
      featureTypes: [
        {
          label: 'Grachtmast',
          description: 'Grachtmast',
          icon: {
            options,
            iconUrl: grachtmastUrl,
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
            iconUrl: overspanningUrl,
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
            iconUrl: gevelarmatuurUrl,
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
            iconUrl: schijnwerperUrl,
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
            iconUrl: overigUrl,
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
            iconUrl: reportedFeatureMarkerUrl,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: 'reported',
        },
        {
          description: 'Het lichtpunt staat niet op de kaart',
          label: 'Onbekend',
          icon: {
            iconUrl: unknownFeatureMarkerUrl,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'not-on-map',
        },
      ],
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.streetlight_select,
    options: {
      validators: [validateObjectLocation('lichtpunt')],
    },
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

  extra_klok_nummer: {
    meta: {
      language: {
        title: 'Locatie',
        subTitle: 'Kies een klok op de kaart',
        unregistered: 'De klok staat niet op de kaart',
        unregisteredId: 'Nummer van de klok',
        objectTypeSingular: 'klok',
        objectTypePlural: 'klokken',
        submit: 'Gebruik deze locatie',
      },
      label: 'Kies de klok waar het om gaat',
      shortLabel: 'Klok(ken) op kaart',
      ifAllOf: {
        subcategory: 'klok',
      },
      wfsFilter:
        '<PropertyIsEqualTo><ValueReference>objecttype_omschrijving</ValueReference><Literal>Klok</Literal></PropertyIsEqualTo><BBOX><gml:Envelope srsName="{srsName}"><lowerCorner>{west} {south}</lowerCorner><upperCorner>{east} {north}</upperCorner></gml:Envelope></BBOX>',
      endpoint: configuration.map.layers?.klokken,
      zoomMin: 14,
      featureTypes: [
        {
          label: 'Klok',
          description: 'Klok',
          icon: {
            options,
            iconUrl: klokUrl,
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
            iconUrl: reportedFeatureMarkerUrl,
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: 'reported',
        },
        {
          description: 'De klok staat niet op de kaart',
          label: 'Onbekend',
          icon: {
            iconUrl: unknownFeatureMarkerUrl,
          },
          idField: 'id',
          typeField: 'type',
          typeValue: 'not-on-map',
        },
      ],
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.clock_select,
    options: {
      validators: [validateObjectLocation('klok')],
    },
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
}

export default straatverlichtingKlokken
