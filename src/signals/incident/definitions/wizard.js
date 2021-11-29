// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import beschrijf from './wizard-step-1-beschrijf'
import vulaan from './wizard-step-2-vulaan'
import contact from './wizard-step-3-contact'
import summary from './wizard-step-4-summary'
import bedankt from './wizard-step-5-bedankt'
import fout from './wizard-step-6-fout'

export default {
  beschrijf: {
    countAsStep: true,
    ...beschrijf,
  },
  vulaan: {
    countAsStep: true,
    ...vulaan,
  },
  contact: {
    countAsStep: true,
    ...contact,
  },
  summary: {
    countAsStep: true,
    ...summary,
  },
  opslaan: {},
  bedankt,
  fout,
}
