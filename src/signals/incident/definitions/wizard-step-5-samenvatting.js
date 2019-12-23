import IncidentNavigation from '../components/IncidentNavigation';
import PreviewComponents from '../components/IncidentPreview/components';
import { createCompoundPreview } from '../components/IncidentPreview/components/CompoundPreview';
import { OVL_KLOKKEN_LAYER, OVL_VERLICHTING_LAYER } from '../../../shared/services/configuration/configuration';

export default {
  label: 'Controleer uw gegevens',
  subheader: 'Maak een aanpassing als dat nodig is.',
  nextButtonLabel: 'Verstuur',
  nextButtonClass: 'action primary',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'CREATE_INCIDENT',
  form: {
    controls: {
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
  preview: {
    beschrijf: {
      source: {
        label: 'Bron',
        render: PreviewComponents.ObjectValue,
        authenticated: true,
      },
      priority: {
        label: 'Urgentie',
        render: PreviewComponents.ObjectValue,
        authenticated: true,
      },
      location: {
        label: 'Locatie',
        render: PreviewComponents.Map,
      },
      description: {
        label: 'Beschrijving',
        render: PreviewComponents.PlainText,
      },
      datetime: {
        label: 'Tijdstip',
        render: PreviewComponents.DateTime,
      },
      images_previews: {
        label: 'Foto',
        render: PreviewComponents.Image,
        optional: true,
      },
    },

    vulaan: { // page route --> /incident/vulaan
      extra_brug: {
        label: 'Naam brug',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      extra_onderhoud_stoep_straat_en_fietspad: {
        label: 'Soort wegdek',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      extra_klok: { // actual incident field name
        label: 'Is de situatie gevaarlijk?',
        render: PreviewComponents.ObjectValue, // use value.label as plaintext,
        optional: true,
      },
      extra_klok_hoeveel: {
        label: 'Aantal lichtpunten',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_klok_probleem: {
        label: 'Probleem',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_klok_nummer: {
        label: 'Klok(ken) op kaart',
        render: createCompoundPreview([
          props => PreviewComponents.MapSelectPreview({ ...props, endpoint: OVL_KLOKKEN_LAYER }),
          ({ label, ...props }) => PreviewComponents.CommaArray(props), // remove label from props
        ]),
        optional: true,
      },
      extra_klok_niet_op_kaart: {
        label: 'Staat niet op kaart',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_klok_niet_op_kaart_nummer: {
        label: 'Klok(ken) niet op kaart',
        render: PreviewComponents.CommaArray,
        optional: true,
      },

      extra_straatverlichting: { // actual incident field name
        label: 'Is de situatie gevaarlijk?',
        render: PreviewComponents.ObjectValue, // use value.label as plaintext,
        optional: true,
      },
      extra_straatverlichting_hoeveel: {
        label: 'Aantal lichtpunten',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_straatverlichting_probleem: {
        label: 'Probleem',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_straatverlichting_nummer: {
        label: 'Lichtpunt(en) op kaart',
        render: createCompoundPreview([
          props => PreviewComponents.MapSelectPreview({ ...props, endpoint: OVL_VERLICHTING_LAYER }),
          ({ label, ...props }) => PreviewComponents.CommaArray(props), // remove label from props
        ]),
        optional: true,
      },
      extra_straatverlichting_niet_op_kaart: {
        label: 'Staat niet op kaart',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_straatverlichting_niet_op_kaart_nummer: {
        label: 'Lichtpunt(en) niet op kaart',
        render: PreviewComponents.CommaArray,
        optional: true,
      },

      // verkeerslicht
      extra_verkeerslicht: {
        label: 'Is de situatie gevaarlijk?',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_verkeerslicht_welk: {
        label: 'Type verkeerslicht',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_verkeerslicht_probleem_voetganger: {
        label: 'Probleem',
        render: PreviewComponents.ListObjectValue,
        optional: true,
      },
      extra_verkeerslicht_probleem_fiets_auto: {
        label: 'Probleem',
        render: PreviewComponents.ListObjectValue,
        optional: true,
      },
      extra_verkeerslicht_probleem_bus_tram: {
        label: 'Probleem',
        render: PreviewComponents.ListObjectValue,
        optional: true,
      },
      extra_verkeerslicht_rijrichting: {
        label: 'Rijrichting',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_verkeerslicht_nummer: {
        label: 'Verkeerslicht nummer',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // afval
      extra_afval: { // actual incident field name
        label: 'Waar vandaan',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_container_kind: {
        label: 'Soort container',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_container_number: {
        label: 'Container nummer',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // Extra bedrijven overlast questions
      extra_bedrijven_overig: {
        label: 'Melding over',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_naam: {
        label: 'Bedrijfsnaam',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_adres: {
        label: 'Uw adres',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_vaker: {
        label: 'Vaker overlast',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_momenten: {
        label: 'Welke momenten',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // Extra overlast openbare ruimte
      extra_auto_scooter_bromfietswrak: {
        label: 'Extra informatie',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_fietswrak: {
        label: 'Extra informatie',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_parkeeroverlast: {
        label: 'Extra informatie',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // Extra overlast op het water
      extra_boten_snelheid_rondvaartboot: {
        label: 'Rondvaartboot',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_boten_snelheid_rederij: {
        label: 'Rederij',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_boten_snelheid_naamboot: {
        label: 'Naam boot',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_boten_snelheid_meer: {
        label: 'Extra informatie',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_boten_geluid_meer: {
        label: 'Extra informatie',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_boten_gezonken_meer: {
        label: 'Extra informatie',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // Extra overlast personen
      extra_personen_overig: {
        label: 'Aantal personen',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_personen_overig_vaker: {
        label: 'Vaker',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_personen_overig_vaker_momenten: {
        label: 'Momenten',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // horeca
      extra_bedrijven_horeca_wat: {
        label: 'Soort bedrijf',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_naam: {
        label: 'Mogelijke veroorzaker',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_adres: {
        label: 'Adres overlast',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_direct_naast: {
        label: 'Aanpandig',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_ramen_dicht: {
        label: 'Overlast met ramen en deuren dicht',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_ramen_dicht_onderneming_lang: {
        label: 'Ramen/deuren gaan',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_evenement: {
        label: 'Geïnformeerd door organisator',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_evenement_einde: {
        label: 'Evenement eindigt om',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_installaties: {
        label: 'Soort installatie',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_personen: {
        label: 'Oorzaak overlast',
        render: PreviewComponents.ListObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_terrassen: {
        label: 'Oorzaak overlast',
        render: PreviewComponents.ListObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_stank: {
        label: 'Soort geur',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_stank_oorzaak: {
        label: 'Vermoedelijke oorzaak',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_stank_weer: {
        label: 'Weersomstandigheden',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_stank_ramen: {
        label: 'Ramen/deuren open',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_vaker: {
        label: 'Gebeurt het vaker?',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_tijdstippen: {
        label: 'Overlast momenten',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_muziek: {
        label: 'Toestemming contact opnemen',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_installaties: {
        label: 'Toestemming contact opnemen',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_ja: {
        label: 'Bel moment',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_ja_nietnu: {
        label: 'Ander bel moment',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_nee: {
        label: 'Liever geen contact',
        render: PreviewComponents.PlainText,
        optional: true,
      },


      // wonen
    },

    telefoon: {
      phone: {
        label: 'Uw telefoonnummer',
        render: PreviewComponents.PlainText,
      },
    },

    email: {
      email: {
        label: 'Uw e-mailadres',
        render: PreviewComponents.PlainText,
      },
    },
  },
};
