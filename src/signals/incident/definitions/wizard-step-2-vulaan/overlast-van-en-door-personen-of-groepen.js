import FormComponents from '../../components/IncidentForm/components/';

export default {
  extra_personen_overig: {
    meta: {
      className: 'col-sm-12 col-md-6',
      ifAllOf: {
        category: 'overlast-van-en-door-personen-of-groepen'
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
        category: 'overlast-van-en-door-personen-of-groepen'
      },
      label: 'Gebeurt het vaker?',
      pathMerge: 'extra_properties',
      value: 'Ja, het gebeurt vaker:'
    },
    render: FormComponents.CheckboxInput
  },
  extra_personen_overig_vaker_momenten: {
    meta: {
      label: 'Geef aan op welke momenten het gebeurt',
      pathMerge: 'extra_properties',
      ifAllOf: {
        extra_personen_overig_vaker: true,
        category: 'overlast-van-en-door-personen-of-groepen'
      }
    },
    render: FormComponents.TextareaInput
  }
};
