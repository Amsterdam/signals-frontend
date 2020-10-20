import changedChildrenList from './changedChildrenList';
import contactDetailsList from './contactDetailsList';
import directingDepartmentList from './directingDepartmentList';
import feedbackList from './feedbackList';
import kindList from './kindList';
import priorityList from './priorityList';
import sourceList from './sourceList';
import stadsdeelList from './stadsdeelList';
import statusList from './statusList';
import typesList from './typesList';

export {
  feedbackList,
  priorityList,
  stadsdeelList,
  statusList,
  sourceList,
  contactDetailsList,
  typesList,
  directingDepartmentList,
};

export default {
  contact_details: contactDetailsList,
  has_changed_children: changedChildrenList,
  directing_department: directingDepartmentList,
  feedback: feedbackList,
  kind: kindList,
  priority: priorityList,
  source: sourceList,
  stadsdeel: stadsdeelList,
  status: statusList,
  type: typesList,
};
