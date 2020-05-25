export default questions => ({
  controls: questions.reduce(
    (acc, question) => ({
      ...acc,
      [question.key]: {
        meta: question.meta,
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
