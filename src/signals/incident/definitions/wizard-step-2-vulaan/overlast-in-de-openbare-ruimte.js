import FormComponents from '../../components/IncidentForm/components/';

export default {
  extra_parkeeroverlast: {
    meta: {
      ifAllOf: {
        subcategory:
          'parkeeroverlast'
      },
      label: 'Kunt u nog meer vertellen (over de auto, motor, etc)?',
      subheader: 'Bijvoorbeeld: kenteken, merk en kleur',
      pathMerge: 'extra_properties'
    },
    render: FormComponents.TextInput
  }
};
