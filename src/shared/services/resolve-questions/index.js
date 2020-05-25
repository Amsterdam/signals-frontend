export default questions => ({
  custom_text: {
    meta: {
      label: 'Dit hebt u net ingevuld:',
      type: 'citation',
      value: '{incident.description}',
      ignoreVisibility: true,
    },
    render: 'PLAIN_TEXT',
  },
  ...questions.reduce(
    (acc, question) => ({
      ...acc,
      [question.key]: {
        meta: question.meta,
        options: question.options,
        render: question.field_type,
      },
    }),
    {}
  ),
  $field_0: {
    isStatic: false,
    render: 'INCIDENT_NAVIGATION',
  },
});
