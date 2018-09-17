import { some } from 'lodash';
import { Validators } from 'react-reactive-form';

import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Beschrijf uw melding',
  getNextStep: (wizard, { subcategory, category }) => {
    if (!some(wizard.vulaan.form.controls, (control) => control.meta && control.meta.ifAllOf && (control.meta.ifAllOf.subcategory === subcategory || control.meta.ifAllOf.category === category))) {
      return 'incident/telefoon';
    }
    return false;
  },
  form: {
    controls: {
      source: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Hoe komt de melding binnen?',
          path: 'source',
          updateIncident: true,
          values: {
            '': 'Vul bron in',
            'Telefoon – CCA': 'Telefoon – CCA',
            'Telefoon – ASC': 'Telefoon – ASC',
            'Telefoon – Interswitch': 'Telefoon – Interswitch',
            'Telefoon – Stadsdeel': 'Telefoon – Stadsdeel',
            'Telefoon – Adoptant': 'Telefoon – Adoptant',
            'E-mail – CCA': 'E-mail – CCA',
            'E-mail – ASC': 'E-mail – ASC',
            'E-mail – Stadsdeel': 'E-mail – Stadsdeel',
            'Webcare – CCA': 'Webcare – CCA',
            'Eigen organisatie': 'Eigen organisatie',
            'Meldkamer burger/ondernemer': 'Meldkamer burger/ondernemer',
            'Meldkamer Handhaver': 'Meldkamer Handhaver',
            'Meldkamer Politie': 'Meldkamer Politie'
          }
        },
        options: {
          validators: [Validators.required]
        },
        authenticated: true,
        render: FormComponents.SelectInput
      },
      location: {
        meta: {
          label: 'Waar is het?',
          subtitle: 'Typ het dichtstbijzijnde adres of klik de locatie aan op de kaart',
          path: 'location',
        },
        options: {
          validators: [Validators.required]
        },
        render: FormComponents.MapInput
      },
      description: {
        meta: {
          label: 'Waar gaat het om?',
          path: 'text',
          placeholder: 'Beschrijf uw melding'
        },
        options: {
          validators: [
            Validators.required,
            Validators.maxLength(3000)
          ]
        },
        render: FormComponents.DescriptionWithClassificationInput
      },
      category: {
        meta: {
          label: 'Categorie',
          path: 'category.main',
          type: 'text'
        },
        options: {
          validators: [Validators.required]
        },
        render: FormComponents.HiddenInput
      },
      subcategory: {
        meta: {
          label: 'Subcategorie',
          path: 'category.sub',
          type: 'text'
        },
        options: {
          validators: [Validators.required]
        },
        render: FormComponents.HiddenInput
      },
      datetime: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Geef het tijdstip aan',
          values: {
            Nu: 'Nu',
            Eerder: 'Eerder'
          },
          updateIncident: true
        },
        options: {
          validators: [Validators.required]
        },
        render: FormComponents.RadioInput
      },
      incident_date: {
        meta: {
          ifAllOf: {
            datetime: 'Eerder'
          },
          updateIncident: true
        },
        render: FormComponents.DateTimeInput,
        strict: false
      },
      incident_time_hours: {
        meta: {
          label: 'Incident time hours',
          readOnly: true
        },
        render: FormComponents.HiddenInput
      },
      incident_time_minutes: {
        meta: {
          label: 'Incident time minutes',
          readOnly: true
        },
        render: FormComponents.HiddenInput
      },
      image: {
        meta: {
          label: 'Wilt u een foto meesturen?',
          submitLabel: 'Foto kiezen'
        },
        render: FormComponents.FileInput
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation
      }
    }
  }
};
