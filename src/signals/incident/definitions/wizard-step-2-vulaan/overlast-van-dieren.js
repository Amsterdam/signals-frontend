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

    extra_dieren_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          category: 'overlast-van-dieren'
        },
        type: 'caution',
        value: [
          'Let op!',
          'U kunt met dit formulier een melding doen van:',
          '• dierplagen (ratten, ganzen, duiven, meeuwen,wespen, etc)',
          '• dode dieren op straat, met uitzondering van dode huisdieren en dode vogels',
          '• voor dode huisdieren en dode vogels op straat kunt u contact opnemen met Dierenambulance',
          {
            type: 'more-link',
            label: 'Dierenambulance Amsterdam',
            href: 'http://ns.nl/klantenservice'
          },
          '• Voor alle andere gevallen: bezoek onze pagina: ',
          {
            type: 'more-link',
            label: 'Melden van zieke, mishandelde en dode dieren, of overlast van dieren',
            href: 'http://ns.nl/klantenservice'
          }
        ],
      },
      render: FormComponents.PlainText
    },
    $field_0: {
      isStatic: false,
      render: IncidentNavigation
    }
  }
};
