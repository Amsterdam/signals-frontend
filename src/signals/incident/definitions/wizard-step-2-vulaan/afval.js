import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

export default {
  controls: {
    custom_text: {
      meta: {
        label: 'Dit hebt u net ingevuld:',
        type: 'citation',
        value: '{incident.description}',
        ignoreVisibility: true,
      },
      render: FormComponents.PlainText,
    },

    extra_afval: {
      meta: {
        ifOneOf: {
          subcategory: [
            'grofvuil',
            'huisafval',
            'puin-sloopafval',
          ],
        },
        label: 'Heeft u een vermoeden waar het afval vandaan komt?',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextareaInput,
    },
    extra_container_kind: {
      meta: {
        ifOneOf: {
          subcategory: [
            'container-is-kapot',
            'container-is-vol',
          ],
        },
        label: 'Weet u om wat voor soort container (papier, plastic, glas, restafval) het gaat?',
        subheader: 'Bijvoorbeeld glas, papier, plastic of restafval',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    extra_container_number: {
      meta: {
        ifOneOf: {
          subcategory: [
            'container-voor-plastic-afval-is-kapot',
            'container-voor-plastic-afval-is-vol',
            'container-is-kapot',
            'container-is-vol',
          ],
        },
        label: 'Weet u het nummer van de container?',
        className: 'col-sm-12 col-md-6',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    $field_0: {
      isStatic: false,
      render: IncidentNavigation,
    },
  },
};
