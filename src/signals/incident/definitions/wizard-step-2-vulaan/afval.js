import FormComponents from '../../components/IncidentForm/components/';
import IncidentNavigation from '../../components/IncidentNavigation';

export default {
  controls: {
    custom_text: {
      meta: {
        label: 'Dit hebt u net ingevuld:',
        type: 'citation',
        value: '{incident.description}',
        ignoreVisibility: true
      },
      render: FormComponents.PlainText
    },

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
    },
    extra_container_kind: {
      meta: {
        ifOneOf: {
          subcategory: [
            'container-is-kapot',
            'container-is-vol'
          ]
        },
        label: 'Hebt u verteld om wat voor soort container het gaat?',
        subheader: 'Bijvoorbeeld glas, papier, plastic of restafval',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_container_number: {
      meta: {
        ifOneOf: {
          subcategory: [
            'container-voor-plastic-afval-is-kapot',
            'container-voor-plastic-afval-is-vol',
            'container-is-kapot',
            'container-is-vol'
          ]
        },
        label: 'Hebt u een nummer van de container?',
        className: 'col-sm-12 col-md-6',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    $field_0: {
      isStatic: false,
      render: IncidentNavigation
    }
  }
};
