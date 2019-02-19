const formatUpdateIncident = (values, incident) => {
  const update = {
    text: values.text,
    location: incident.location,
    status: {
      state: 'm'
    },
    category: {
      sub_category: values.subcategory
    },
    priority: {
      priority: values.priority
    }
  };

  if (values.note) {
    update.notes = [{
      text: values.note
    }];
  }

  return update;
};

export default formatUpdateIncident;
