// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Attachment } from '../../../signals/incident-management/containers/IncidentDetail/types'

export const getAttachmentFileName = (location: Attachment['location']) =>
  location.split('?')[0].split('/').pop() || ''
