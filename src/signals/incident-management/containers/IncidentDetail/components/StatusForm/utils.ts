// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { AlertLevel } from '@amsterdam/asc-ui'

import configuration from 'shared/services/configuration/configuration'
import {
  changeStatusOptionList,
  isStatusClosed,
} from 'signals/incident-management/definitions/statusList'
import { StatusCode } from 'types/status-code'

import * as constants from './constants'

export const emailSentWhenStatusChangedTo = ({
  toStatus,
  fromStatus,
  isSplitIncident,
}: {
  toStatus: StatusCode
  fromStatus: StatusCode
  isSplitIncident: boolean
}): boolean => {
  if (isSplitIncident) return false

  if (
    !configuration.featureFlags.reporterMailHandledNegativeContactEnabled &&
    fromStatus === StatusCode.VerzoekTotHeropenen &&
    toStatus === StatusCode.Afgehandeld
  ) {
    return false
  }

  return Boolean(
    changeStatusOptionList.find(
      ({ email_sent_when_set, key }) => email_sent_when_set && toStatus === key
    )
  )
}

export const textIsRequired = ({
  fromStatus,
  toStatus,
  isSplitIncident,
}: {
  fromStatus: StatusCode
  toStatus: StatusCode
  isSplitIncident: boolean
}): boolean => {
  if (
    isSplitIncident ||
    !configuration.featureFlags.reporterMailHandledNegativeContactEnabled
  ) {
    return [
      StatusCode.Afgehandeld,
      StatusCode.Ingepland,
      StatusCode.Heropend,
      StatusCode.ReactieGevraagd,
    ].includes(toStatus)
  } else {
    return emailSentWhenStatusChangedTo({
      fromStatus,
      toStatus,
      isSplitIncident,
    })
  }
}

type Warning = {
  key: string
  level: AlertLevel
  content: string
  heading?: string
}

export const determineWarnings = ({
  originalStatus,
  toStatus,
  isSplitIncident,
  hasEmail,
  hasOpenChildren,
  categorySlug,
}: {
  originalStatus: StatusCode
  toStatus: StatusCode
  isSplitIncident: boolean
  hasEmail: boolean
  hasOpenChildren: boolean
  categorySlug?: string
}): Warning[] => {
  const warnings: Warning[] = []

  if (isSplitIncident) return []

  if (isStatusClosed(toStatus) && hasOpenChildren) {
    warnings.push({
      key: 'has-open-child-incidents-warning',
      heading: constants.DEELMELDINGEN_STILL_OPEN_HEADING,
      content: constants.DEELMELDINGEN_STILL_OPEN_CONTENT,
      level: 'info',
    })
  }

  if (originalStatus === StatusCode.ReactieGevraagd && hasEmail) {
    warnings.push({
      key: 'has-open-reply-request-warning',
      heading: constants.REPLY_CHANGE_STATUS_HEADING,
      content: constants.REPLY_CHANGE_STATUS_CONTENT,
      level: 'info',
    })
  }

  if (
    configuration.featureFlags.disableClosingCategoryOverigOverig &&
    toStatus === StatusCode.Afgehandeld &&
    categorySlug === 'overig'
  ) {
    warnings.push({
      key: 'has-category-overig',
      heading: constants.CATEGORY_OVERIG_HEADING,
      content: constants.CATEGORY_OVERIG_CONTENT,
      level: 'error',
    })
  } else if (toStatus === StatusCode.Afgehandeld)
    warnings.push({
      key: 'end-status-warning',
      content: constants.AFGEHANDELD_CONTENT,
      level: 'neutral',
    })

  if (toStatus === StatusCode.ReactieGevraagd && !hasEmail) {
    warnings.push({
      key: 'has-no-email-reply-warning',
      heading: constants.REPLY_NO_MAIL_HEADING,
      content: constants.REPLY_NO_MAIL_CONTENT,
      level: 'error',
    })
  }

  return warnings
}

export const getTextConfig = (statusCode: StatusCode) => {
  return statusCode === StatusCode.ReactieGevraagd
    ? {
        label: constants.REPLY_MAIL_LABEL,
        maxLength: constants.REPLY_MAIL_MAX_LENGTH,
        rows: 6,
      }
    : {
        label: constants.DEFAULT_TEXT_LABEL,
        maxLength: constants.DEFAULT_TEXT_MAX_LENGTH,
        rows: 9,
      }
}
