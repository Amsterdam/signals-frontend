import some from 'lodash.some';
import { Validators } from 'react-reactive-form';
import { sourceList, priorityList, typesList } from 'signals/incident-management/definitions';
import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/form';
import checkVisibility from '../services/check-visibility';
import getStepControls from '../services/get-step-controls';

const sourceValuesObj = sourceList.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), { '': 'Vul bron in' });
const priorityValuesList = priorityList.reduce((acc, { key, value, info }) => ({ ...acc, [key]: { value, info } }), {});
const typesValuesList = typesList.reduce((acc, { key, value, info }) => ({ ...acc, [key]: { value, info } }), {});

export default {
  label: 'Beschrijf uw melding',
  getNextStep: (wizard, incident) => {
    if (
      !some(getStepControls(wizard.vulaan, incident), control => {
        if (control.meta && !control.meta.ignoreVisibility) {
          return checkVisibility(control, incident);
        }
        return false;
      })
    ) {
      return 'incident/telefoon';
    }
    return false;
  },
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  postponeSubmitWhenLoading: 'incidentContainer.loadingClassification',
  form: {
    controls: {
      source: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Hoe komt de melding binnen?',
          path: 'source',
          values: sourceValuesObj,
        },
        options: {
          validators: [Validators.required],
        },
        authenticated: true,
        render: FormComponents.SelectInput,
      },
      location: {
        meta: {
          label: 'Waar is het?',
          subtitle: 'Typ het dichtstbijzijnde adres of klik de locatie aan op de kaart',
          path: 'location',
        },
        options: {
          validators: [Validators.required],
        },
        render: FormComponents.MapInput,
      },
      description: {
        meta: {
          label: 'Waar gaat het om?',
          subtitle: 'Typ geen persoonsgegevens in deze omschrijving, dit wordt apart gevraagd',
          path: 'text',
          maxLength: 1000,
        },
        options: {
          validators: [Validators.required, Validators.maxLength(1000)],
        },
        render: FormComponents.DescriptionWithClassificationInput,
      },
      category: {
        meta: {
          label: 'Categorie',
          path: 'category',
          type: 'text',
        },
        options: {
          validators: [Validators.required],
        },
        render: FormComponents.HiddenInput,
      },
      subcategory: {
        meta: {
          label: 'Subcategorie',
          path: 'subcategory',
          type: 'text',
        },
        options: {
          validators: [Validators.required],
        },
        render: FormComponents.HiddenInput,
      },
      datetime: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Geef het tijdstip aan',
          values: {
            Nu: 'Nu',
            Eerder: 'Eerder',
          },
        },
        options: {
          validators: [Validators.required],
        },
        render: FormComponents.RadioInput,
      },
      incident_date: {
        meta: {
          ifAllOf: {
            datetime: 'Eerder',
          },
        },
        render: FormComponents.DateTimeInput,
        strict: false,
      },
      incident_time_hours: {
        meta: {
          label: 'Incident time hours',
          readOnly: true,
        },
        render: FormComponents.HiddenInput,
      },
      incident_time_minutes: {
        meta: {
          label: 'Incident time minutes',
          readOnly: true,
        },
        render: FormComponents.HiddenInput,
      },
      priority: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Wat is de urgentie?',
          path: 'priority',
          values: priorityValuesList,
        },
        options: {
          validators: [Validators.required],
        },
        authenticated: true,
        render: FormComponents.RadioInput,
      },
      type: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Type',
          path: 'type',
          values: typesValuesList,
        },
        authenticated: true,
        render: FormComponents.RadioInput,
      },
      images_previews: {
        meta: {
          label: 'images_previews',
        },
        render: FormComponents.HiddenInput,
      },
      images_errors: {
        meta: {
          label: 'images_errors',
        },
        render: FormComponents.HiddenInput,
      },
      images: {
        meta: {
          label: "Foto's toevoegen",
          subtitle: 'Voeg een foto toe om de situatie te verduidelijken',
          minFileSize: 30 * 2 ** 10, // 30 KiB.
          maxFileSize: 8 * 2 ** 20, // 8 MiB.
          allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          maxNumberOfFiles: 3,
        },
        render: FormComponents.FileInput,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
};
