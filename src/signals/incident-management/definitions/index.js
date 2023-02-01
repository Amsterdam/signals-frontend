// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import assignedUserEmailList from './assignedUserEmailList'
import changedChildrenList from './changedChildrenList'
import contactDetailsList from './contactDetailsList'
import feedbackList from './feedbackList'
import kindList from './kindList'
import priorityList from './priorityList'
import punctualityList from './punctualityList'
import stadsdeelList from './stadsdeelList'
import statusList from './statusList'
import typesList from './typesList'

export {
  feedbackList,
  punctualityList,
  priorityList,
  stadsdeelList,
  statusList,
  contactDetailsList,
  typesList,
}

export default {
  contact_details: contactDetailsList,
  has_changed_children: changedChildrenList,
  feedback: feedbackList,
  punctuality: punctualityList,
  kind: kindList,
  priority: priorityList,
  stadsdeel: stadsdeelList,
  status: statusList,
  type: typesList,
  assigned_user_email: assignedUserEmailList,
}
