const formatUpdateIncident = values => {
  const update = {};

  if (values && values.priority) {
    update.priority = {
      priority: values.priority,
    };
  }

  if (values && values.note) {
    update.notes = [{
      text: values.note,
    }];
  }

  return update;
};

export default formatUpdateIncident;
