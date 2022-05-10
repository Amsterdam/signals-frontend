// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import appConfiguration from 'shared/services/configuration/configuration'

import { QuestionFieldType } from 'types/question'
import type { IconOptions } from 'leaflet'
import { UNREGISTERED_TYPE } from 'signals/incident/components/form/MapSelectors/constants'
import type ConfigurationType from '../../../../../app.amsterdam.json'

import { validateObjectLocation } from '../../services/custom-validators'
import { FeatureStatus } from '../../components/form/MapSelectors/types'

export const ICON_SIZE = 40

const options: Pick<IconOptions, 'className' | 'iconSize'> = {
  className: 'object-marker',
  iconSize: [ICON_SIZE, ICON_SIZE],
}

const configuration = appConfiguration as unknown as typeof ConfigurationType

const straatverlichtingKlokken = {
  // This element will be enabled each year near the christmass.
  // Comment/Uncomment next block to show/hide it.
  // extra_kerstverlichting: {
  //   meta: {
  //     type: 'alert-inverted',
  //     value:
  //       'Doet de sierverlichting in een winkelstraat het niet? Of hebt u last van de kerstverlichting? Neem dan contact op met de winkeliersvereniging. De gemeente gaat hier helaas niet over.',
  //     ifAllOf: {
  //       subcategory: 'lantaarnpaal-straatverlichting',
  //     },
  //   },
  //   render: QuestionFieldType.PlainText,
  // },

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
            iconUrl: '/assets/images/openbare_verlichting/grachtmast.svg',
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
            iconUrl: '/assets/images/openbare_verlichting/overspanning.svg',
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
            iconUrl: '/assets/images/openbare_verlichting/gevelarmatuur.svg',
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
            iconUrl: '/assets/images/openbare_verlichting/schijnwerper.svg',
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
            iconUrl: '/assets/images/openbare_verlichting/overig.svg',
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: '4',
        },
        {
          description: 'Het lichtpunt staat niet op de kaart',
          label: 'Onbekend',
          icon: {
            iconUrl: '/assets/images/featureUnknownMarker.svg',
          },
          idField: 'id',
          typeField: 'type',
          typeValue: UNREGISTERED_TYPE,
        },
      ],
      featureStatusTypes: [
        {
          label: 'Is gemeld',
          description: 'Is gemeld',
          icon: {
            options,
            iconUrl: '/assets/images/icon-reported-marker.svg',
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: FeatureStatus.REPORTED,
          statusField: 'meldingstatus',
          statusValues: [1],
        },
      ],
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.StreetlightSelect,
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
    render: QuestionFieldType.RadioInput,
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
        niet_gevaarlijk: 'Nee, niet gevaarlijk',
        drie_of_meer_kapot: 'Ja, 3 of meer lampen in de straat zijn kapot',
        is_gevolg_van_aanrijding: 'Ja, het is een gevolg van een aanrijding',
        lamp_op_grond_of_scheef:
          'Ja, de lamp of lantaarnpaal ligt op de grond of staat gevaarlijk scheef',
        deurtje_weg_of_open:
          'Ja, er zit geen deurtje meer in de mast of het deurtje staat open',
        losse_kabels_zichtbaar_of_lamp_los:
          'Ja, er hangen losse stroomkabels of de lamp hangt los',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
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
    render: QuestionFieldType.PlainText,
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
            iconUrl: '/assets/images/openbare_verlichting/klok.svg',
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: '1',
        },
        {
          description: 'De klok staat niet op de kaart',
          label: 'Onbekend',
          icon: {
            iconUrl: '/assets/images/featureUnknownMarker.svg',
          },
          idField: 'id',
          typeField: 'type',
          typeValue: UNREGISTERED_TYPE,
        },
      ],
      featureStatusTypes: [
        {
          label: 'Is gemeld',
          description: 'Is gemeld',
          icon: {
            options,
            iconUrl: '/assets/images/icon-reported-marker.svg',
          },
          idField: 'objectnummer',
          typeField: 'objecttype',
          typeValue: FeatureStatus.REPORTED,
          statusField: 'meldingstatus',
          statusValues: [1],
        },
      ],
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.ClockSelect,
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
        niet_gevaarlijk: 'Nee, niet gevaarlijk',
        is_gevolg_van_aanrijding: 'Ja, het is een gevolg van een aanrijding',
        klok_op_grond_of_scheef:
          'Ja, de klok ligt op de grond of staat gevaarlijk scheef',
        deurtje_weg_of_open:
          'Ja, er zit geen deurtje meer in de mast of het deurtje staat open',
        losse_kabels_zichtbaar_of_lamp_los:
          'Ja, er hangen losse stroomkabels of de klok hangt los',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
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
    render: QuestionFieldType.PlainText,
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
        klok_staat_stil_op_12_uur: 'Klok staat stil op 12 uur',
        verlichting_klok_brandt_niet: 'Verlichting klok brandt niet',
        klok_is_zichtbaar_beschadigd: 'Klok is beschadigd',
        overig: 'Overig',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
}

export default straatverlichtingKlokken
