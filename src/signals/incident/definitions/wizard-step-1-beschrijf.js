import { some } from 'lodash';
import { Validators } from 'react-reactive-form';

import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/form';
import { checkVisibility } from '../services/format-conditional-form';

export default {
  label: 'Beschrijf uw melding',
  getNextStep: (wizard, { subcategory, category }) => {
    if (!some(wizard.vulaan.form.controls, (control) => control.meta && control.meta.pathMerge && checkVisibility(control, {
      category,
      subcategory
    }))) {
      return 'incident/telefoon';
    }
    return false;
  },
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  formAction: 'UPDATE_INCIDENT',
  form: {
    controls: {
      source: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Hoe komt de melding binnen?',
          path: 'source',
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
      priority: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Wat is de urgentie?',
          path: 'priority',
          values: {
            normal: 'Normaal',
            high: 'Hoog'
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
          placeholder: 'Beschrijf uw melding',
          maxLength: 1000,
          doNotUpdateValue: true
        },
        options: {
          validators: [
            Validators.required,
            Validators.maxLength(1000)
          ]
        },
        render: FormComponents.DescriptionWithClassificationInput
      },
      category: {
        meta: {
          label: 'Categorie',
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
          type: 'text'
        },
        options: {
          validators: [Validators.required]
        },
        render: FormComponents.HiddenInput
      },
      subcategory_link: {
        meta: {
          label: 'Subcategorie',
          path: 'category.sub_category',
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
          }
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
          }
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
      images_previews: {
        meta: {
          label: 'images_previews'
        },
        render: FormComponents.HiddenInput
      },
      images_errors: {
        meta: {
          label: 'images_errors'
        },
        render: FormComponents.HiddenInput
      },
      images: {
        meta: {
          label: 'Foto\'s toevoegen',
          subtitle: 'Voeg een foto toe om de situatie te verduidelijken.',
          maxFileSize: 8388608,
          allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          maxNumberOfFiles: 3
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
