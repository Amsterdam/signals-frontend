import IncidentNavigation from '../components/IncidentNavigation';
import PreviewComponents from '../components/IncidentPreview/components';
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
        render: ({ value }) => value.label,
        authenticated: true,
      },
      priority: {
        label: 'Urgentie',
        render: ({ value }) => value.label,
        authenticated: true,
      },
      location: {
        label: 'Locatie',
        render: PreviewComponents.Map,
      },
      description: {
        label: 'Beschrijving',
        render: ({ value }) => value,
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
        render: ({ value }) => value,
        optional: true,
      },

      extra_onderhoud_stoep_straat_en_fietspad: {
        label: 'Soort wegdek',
        render: ({ value }) => value,
        optional: true,
      },

      extra_klok: { // actual incident field name
        label: 'Is de situatie gevaarlijk?',
        render: ({ value }) => value.label, // use value.label as plaintext,
        optional: true,
      },
      extra_klok_hoeveel: {
        label: 'Aantal lichtpunten',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_klok_probleem: {
        label: 'Probleem',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_klok_nummer: {
        label: 'Klok(ken) op kaart',
        render: props => PreviewComponents.MapSelectPreview({ ...props, endpoint: OVL_KLOKKEN_LAYER }),
        optional: true,
      },
      extra_klok_niet_op_kaart: {
        label: 'Staat niet op kaart',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_klok_niet_op_kaart_nummer: {
        label: 'Klok(ken) niet op kaart',
        render: ({ value }) => value.join('; '),
        optional: true,
      },

      extra_straatverlichting: { // actual incident field name
        label: 'Is de situatie gevaarlijk?',
        render: ({ value }) => value.label, // use value.label as plaintext,
        optional: true,
      },
      extra_straatverlichting_hoeveel: {
        label: 'Aantal lichtpunten',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_straatverlichting_probleem: {
        label: 'Probleem',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_straatverlichting_nummer: {
        label: 'Lichtpunt(en) op kaart',
        render: props => PreviewComponents.MapSelectPreview({ ...props, endpoint: OVL_VERLICHTING_LAYER }),
        optional: true,
      },
      extra_straatverlichting_niet_op_kaart: {
        label: 'Staat niet op kaart',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_straatverlichting_niet_op_kaart_nummer: {
        label: 'Lichtpunt(en) niet op kaart',
        render: ({ value }) => value.join('; '),
        optional: true,
      },

      // verkeerslicht
      extra_verkeerslicht: {
        label: 'Is de situatie gevaarlijk?',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_verkeerslicht_welk: {
        label: 'Type verkeerslicht',
        render: ({ value }) => value.label,
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
        render: ({ value }) => value,
        optional: true,
      },
      extra_verkeerslicht_nummer: {
        label: 'Verkeerslicht nummer',
        render: ({ value }) => value,
        optional: true,
      },

      // afval
      extra_afval: { // actual incident field name
        label: 'Waar vandaan',
        render: ({ value }) => value,
        optional: true,
      },
      extra_container_kind: {
        label: 'Soort container',
        render: ({ value }) => value,
        optional: true,
      },
      extra_container_number: {
        label: 'Container nummer',
        render: ({ value }) => value,
        optional: true,
      },

      // Extra bedrijven overlast questions
      extra_bedrijven_overig: {
        label: 'Melding over',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_naam: {
        label: 'Bedrijfsnaam',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_adres: {
        label: 'Uw adres',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_vaker: {
        label: 'Vaker overlast',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_momenten: {
        label: 'Welke momenten',
        render: ({ value }) => value,
        optional: true,
      },

      // Extra overlast openbare ruimte
      extra_auto_scooter_bromfietswrak: {
        label: 'Extra informatie',
        render: ({ value }) => value,
        optional: true,
      },
      extra_fietswrak: {
        label: 'Extra informatie',
        render: ({ value }) => value,
        optional: true,
      },
      extra_parkeeroverlast: {
        label: 'Extra informatie',
        render: ({ value }) => value,
        optional: true,
      },

      // Extra overlast op het water
      extra_boten_snelheid_rondvaartboot: {
        label: 'Rondvaartboot',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_boten_snelheid_rederij: {
        label: 'Rederij',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_boten_snelheid_naamboot: {
        label: 'Naam boot',
        render: ({ value }) => value,
        optional: true,
      },
      extra_boten_snelheid_meer: {
        label: 'Extra informatie',
        render: ({ value }) => value,
        optional: true,
      },
      extra_boten_geluid_meer: {
        label: 'Extra informatie',
        render: ({ value }) => value,
        optional: true,
      },
      extra_boten_gezonken_meer: {
        label: 'Extra informatie',
        render: ({ value }) => value,
        optional: true,
      },

      // Extra overlast personen
      extra_personen_overig: {
        label: 'Aantal personen',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_personen_overig_vaker: {
        label: 'Vaker',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_personen_overig_vaker_momenten: {
        label: 'Momenten',
        render: ({ value }) => value,
        optional: true,
      },

      // horeca
      extra_bedrijven_horeca_wat: {
        label: 'Soort bedrijf',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_naam: {
        label: 'Mogelijke veroorzaker',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_horeca_adres: {
        label: 'Adres overlast',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_direct_naast: {
        label: 'Aanpandig',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_ramen_dicht: {
        label: 'Overlast met ramen en deuren dicht',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_ramen_dicht_onderneming_lang: {
        label: 'Ramen/deuren gaan',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_evenement: {
        label: 'Geïnformeerd door organisator',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_evenement_einde: {
        label: 'Evenement eindigt om',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_horeca_installaties: {
        label: 'Soort installatie',
        render: ({ value }) => value,
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
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_horeca_stank_oorzaak: {
        label: 'Vermoedelijke oorzaak',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_horeca_stank_weer: {
        label: 'Weersomstandigheden',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_horeca_stank_ramen: {
        label: 'Ramen/deuren open',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_vaker: {
        label: 'Gebeurt het vaker?',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_tijdstippen: {
        label: 'Overlast momenten',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_muziek: {
        label: 'Toestemming contact opnemen',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_installaties: {
        label: 'Toestemming contact opnemen',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_ja: {
        label: 'Bel moment',
        render: ({ value }) => value.label,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_ja_nietnu: {
        label: 'Ander bel moment',
        render: ({ value }) => value,
        optional: true,
      },
      extra_bedrijven_horeca_muziek_geluidmeting_nee: {
        label: 'Liever geen contact',
        render: ({ value }) => value,
        optional: true,
      },


      // wonen - woningdelen
      extra_wonen_woningdelen_vermoeden: {
        label: 'Vermoeden',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_woningdelen_eigenaar: {
        label: 'Eigenaar',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_woningdelen_adres_huurder: {
        label: 'Adres huurder',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woningdelen_aantal_personen: {
        label: 'Aantal personen',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woningdelen_bewoners_familie: {
        label: 'Bewoners familie',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woningdelen_samenwonen: {
        label: 'Samenwonen',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woningdelen_wisselende_bewoners: {
        label: 'Wisselende bewoners',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },

      // wonen - onderhuur
      extra_wonen_onderhuur_naam_huurder: {
        label: 'Naam huurder',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_onderhuur_huurder_woont: {
        label: 'Huurder woont',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_onderhuur_adres_huurder: {
        label: 'Adres huurder',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_onderhuur_aantal_personen: {
        label: 'Aantal personen',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_onderhuur_bewoners_familie: {
        label: 'Bewoners familie',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_onderhuur_naam_bewoners: {
        label: 'Naam bewoners',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_onderhuur_woon_periode: {
        label: 'Woon periode',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },

      // wonen - leegstand
      extra_wonen_leegstand_naam_eigenaar: {
        label: 'Naam eigenaar',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_leegstand_periode: {
        label: 'Periode leegstand',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_leegstand_woning_gebruik: {
        label: 'Woning gebruik',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_leegstand_naam_persoon: {
        label: 'Naam persoon',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_leegstand_activiteit_in_woning: {
        label: 'Activiteit in de woning',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_leegstand_iemand_aanwezig: {
        label: 'Iemand aanwezig',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // wonen - leegstand en onderhuur
      extra_wonen_iemand_aanwezig: {
        label: 'Iemand aanwezig',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // wonen - vakantieverhuur
      extra_wonen_vakantieverhuur_toeristen_aanwezig: {
        label: 'Toeristen aanwezig',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_vakantieverhuur_bellen_of_formulier: {
        label: 'Bellen of meldingsformulier',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_vakantieverhuur_aantal_mensen: {
        label: 'Aantal personen',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_vakantieverhuur_hoe_vaak: {
        label: 'Hoe vaak',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_vakantieverhuur_wanneer: {
        label: 'Wanneer',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_vakantieverhuur_bewoning: {
        label: 'Bewoning',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_vakantieverhuur_naam_bewoner: {
        label: 'Naam bewoner',
        render: PreviewComponents.PlainText,
        optional: true,
      },
      extra_wonen_vakantieverhuur_online_aangeboden: {
        label: 'Online aangeboden',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_vakantieverhuur_link_advertentie: {
        label: 'Link advertentie',
        render: PreviewComponents.PlainText,
        optional: true,
      },

      // wonen - woonkwaliteit
      extra_wonen_woonkwaliteit_direct_gevaar: {
        label: 'Direct gevaar',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: {
        label: 'Gemeld bij eigenaar',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woonkwaliteit_bewoner: {
        label: 'Bewoner',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woonkwaliteit_namens_bewoner: {
        label: 'Namens bewoner',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woonkwaliteit_toestemming_contact: {
        label: 'Toestemming contact opnemen',
        render: PreviewComponents.ObjectValue,
        optional: true,
      },
      extra_wonen_woonkwaliteit_geen_contact: {
        label: 'Toestemming contact opnemen',
        render: PreviewComponents.PlainText,
        optional: true,
      },

    },

    telefoon: {
      phone: {
        label: 'Uw telefoonnummer',
        render: ({ value }) => value,
      },
    },

    email: {
      email: {
        label: 'Uw e-mailadres',
        render: ({ value }) => value,
      },
    },
  },
};
