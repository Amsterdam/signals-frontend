import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants';

export const overlastInDeOpenbareRuimte = {
  extra_auto_scooter_bromfietswrak: {
    meta: {
      ifAllOf: {
        subcategory:
          'auto-scooter-bromfietswrak',
      },
      label: 'Zijn er nog meer dingen die u ons kunt vertellen over hoe het wrak eruit ziet en de plek waar het ligt?',
      shortLabel: 'Extra informatie',
      subtitle: 'Bijvoorbeeld: kenteken, merk, kleur, roest, zonder wielen',
      pathMerge: 'extra_properties',
      autoFocus: true,
    },
    render: FIELD_TYPE_MAP.text_input,
  },
  extra_fietswrak: {
    meta: {
      ifAllOf: {
        subcategory:
          'fietswrak',
      },
      label: 'Zijn er nog meer dingen die u ons kunt vertellen over hoe het wrak eruit ziet en de plek waar het ligt?',
      subtitle: 'Bijvoorbeeld: merk, kleur, roest, zonder wielen',
      shortLabel: 'Extra informatie',
      pathMerge: 'extra_properties',
      autoFocus: true,
    },
    render: FIELD_TYPE_MAP.text_input,
  },
  extra_parkeeroverlast: {
    meta: {
      ifAllOf: {
        subcategory:
          'parkeeroverlast',
      },
      label: 'Zijn er nog meer dingen die u ons kunt vertellen over de kenmerken van de auto, bus of motor?',
      shortLabel: 'Extra informatie',
      subtitle: 'Bijvoorbeeld: kenteken, merk en kleur',
      pathMerge: 'extra_properties',
      autoFocus: true,
    },
    render: FIELD_TYPE_MAP.text_input,
  },
};

export default overlastInDeOpenbareRuimte;
