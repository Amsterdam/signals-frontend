import FormComponents from '../../components/IncidentForm/components/';

export default {
  extra_afval: {
    meta: {
      ifOneOf: {
        subcategory: [
          'bedrijfsafval',
          'grofvuil',
          'huisafval',
          'puin-sloopafval'
        ]
      },
      label: 'Hebt u verteld waar het afval vandaan komt?',
      pathMerge: 'extra_properties'
    },
    render: FormComponents.TextareaInput
  }
};
