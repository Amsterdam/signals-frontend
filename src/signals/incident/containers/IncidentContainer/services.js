const fieldTypeMap = {
  checkbox_input: 'CheckboxInput',
  date_time_input: 'DateTimeInput',
  description_with_classification_input: 'DescriptionWithClassificationInput',
  emphasis_checkbox_input: 'EmphasisCheckboxInput',
  file_input: 'FileInput',
  handling_message: 'HandlingMessage',
  header: 'Header',
  hidden_input: 'HiddenInput',
  incident_navigation: 'IncidentNavigation',
  map_input: 'MapInput',
  map_select: 'MapSelect',
  multi_text_input: 'MultiTextInput',
  plain_text: 'PlainText',
  radio_input: 'RadioInputGroup',
  select_input: 'SelectInput',
  text_input: 'TextInput',
  textarea_input: 'TextareaInput',
};

const validatorMap = {
  email: 'email',
  max: 'max',
  max_length: 'maxLength',
  min: 'min',
  min_length: 'minLength',
  pattern: 'pattern',
  required: 'required',
  required_true: 'requiredTrue',
};

const mapValidatorWithArgs = ([key, ...args]) => [validatorMap[key], ...args];
const mapValidator = key => (Array.isArray(key) ? mapValidatorWithArgs(key) : validatorMap[key]);

export const resolveQuestions = questions => ({
  custom_text: {
    meta: {
      label: 'Dit hebt u net ingevuld:',
      type: 'citation',
      value: '{incident.description}',
      ignoreVisibility: true,
    },
    render: fieldTypeMap.plain_text,
  },
  ...questions.reduce(
    (acc, question) => ({
      ...acc,
      [question.key]: {
        meta: question.meta,
        options: {
          validators: (question.meta?.validators || []).map(mapValidator),
        },
        render: fieldTypeMap[question.field_type],
      },
    }),
    {}
  ),
  $field_0: {
    isStatic: false,
    render: fieldTypeMap.incident_navigation,
  },
});
