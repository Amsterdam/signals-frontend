const parseQuestion = (question, values = []) => {
  question.forEach(metaValue => {
    if (typeof metaValue === 'string') {
      values.push(metaValue);
    } else if (metaValue.props.items) {
      parseQuestion(metaValue.props.items, values);
    } else {
      values.push(metaValue.props.children);
    }
  });

  return values;
};

export const questionsToMarkdown = questions => {
  let lines = [];

  Object.entries(questions).forEach(([categoryName, options]) => {
    lines.push(`# ${categoryName}`);
    lines.push('');
    Object.entries(options.controls).forEach(([questionId, question]) => {
      if (questionId.startsWith('$field_0') || questionId.startsWith('custom_text')) return;

      if (question.meta.subtitle) {
        lines.push(`### ${question.meta.label} (${question.meta.subtitle})`);
      } else if (question.meta.label) {
        lines.push(`### ${question.meta.label}`);
        if (question.meta.subtitle) lines.push(question.meta.subtitle);
      } else if (Array.isArray(question.meta.value)) {
        lines = lines.concat(parseQuestion(question.meta.value));
      } else {
        lines.push(question.meta.value);
      }

      if (question.meta.values) Object.values(question.meta.values).forEach(answer => { lines.push(`* ${answer}`); });

      lines.push('');
    });
  });

  return lines;
};

export const questionsToJSON = questions => {
  const result = {};

  Object.entries(questions).forEach(([categoryName, options]) => {
    result[categoryName] = {};
    Object.entries(options.controls).forEach(([questionId, question]) => {
      if (questionId.startsWith('$field_0') || questionId.startsWith('custom_text')) return;

      const category = {
        subtitle: question.meta.subtitle,
        label: question.meta.label,
        shortLabel: question.meta.shortLabel,
        values: question.meta.values,
      };

      if (question.meta.values) {
        category.answers = question.meta.values;
      } else if (Array.isArray(question.meta.value)) {
        category.answers = [];
        category.answers = category.answers.concat(parseQuestion(question.meta.value));
      } else {
        category.value = question.meta.value;
      }

      result[categoryName][questionId] = category;
    });
  });

  return result;
};
