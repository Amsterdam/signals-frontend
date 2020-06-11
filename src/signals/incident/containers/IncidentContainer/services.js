const fieldTypeMap = {
  checkbox_input: 'CheckboxInput',
  incident_navigation: 'IncidentNavigation',
  plain_text: 'PlainText',
  radio_input: 'RadioInputGroup',
  text_input: 'TextInput',
};

const validatorMap = {
  email: 'email',
  max_length: 'maxLength',
  required: 'required',
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

export default resolveQuestions;
