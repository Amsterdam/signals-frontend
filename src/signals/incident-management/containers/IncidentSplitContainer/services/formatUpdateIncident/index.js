const formatUpdateIncident = (values, originalIncident) => {
  const update = {
    status: {
      state: 'm'
    }
  };

  if (values && values.text) {
    update.text = values.text;
  }

  if (originalIncident && originalIncident.location) {
    update.location = { ...originalIncident.location };
  }

  if (values && values.subcategory) {
    update.category = {
      sub_category: values.subcategory
    };
  }

  if (values && values.priority) {
    update.priority = {
      priority: values.priority
    };
  }

  if (values && values.note) {
    update.notes = [{
      text: values.note
    }];
  }

  return update;
};

export default formatUpdateIncident;
