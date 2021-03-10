import changedChildrenList from './changedChildrenList';
import contactDetailsList from './contactDetailsList';
import feedbackList from './feedbackList';
import kindList from './kindList';
import priorityList from './priorityList';
import stadsdeelList from './stadsdeelList';
import statusList from './statusList';
import typesList from './typesList';
import assignedUserEmailList from './assignedUserEmailList';

export {
  feedbackList,
  priorityList,
  stadsdeelList,
  statusList,
  contactDetailsList,
  typesList
};

export default {
  contact_details: contactDetailsList,
  has_changed_children: changedChildrenList,
  feedback: feedbackList,
  kind: kindList,
  priority: priorityList,
  stadsdeel: stadsdeelList,
  status: statusList,
  type: typesList,
  assigned_user_email: assignedUserEmailList,
};
