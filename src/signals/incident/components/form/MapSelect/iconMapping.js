// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import KlokIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Klok-marker.svg'
import KlokSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Klok_select-marker.svg'
import OverspanningIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Overspanning-marker.svg'
import OverspanningSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Overspanning_select-marker.svg'
import GevelArmatuurIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_GevelArmatuur-marker.svg'
import GevelArmatuurSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_GevelArmatuur_select-marker.svg'
import GrachtmastIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Grachtmast-marker.svg'
import GrachtmastSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Grachtmast_select-marker.svg'
import SchijnwerperIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Schijnwerper-marker.svg'
import SchijnwerperSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Schijnwerper_select-marker.svg'
import OverigSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Overig_select-marker.svg'
import OverigIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Overig-marker.svg'
import IsReportedIcon from '!!file-loader!../../../../../shared/images/icon-reported-marker.svg'

const defaultOptions = {
  className: 'object-marker',
  iconSize: [32, 32],
}

const KLOK = 1
const OVERSPANNING = 2
const GEVEL_ARMATUUR = 3
const GRACHTMAST = 5
const OVERIG = 4
const SCHIJNWERPER = 10

// Maps object type field ('objecttype') to the corresponding icon.
export const OVL_MAPPING = {
  [KLOK]: {
    default: L.icon({ ...defaultOptions, iconUrl: KlokIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: KlokSelectIcon }),
  },
  [OVERSPANNING]: {
    default: L.icon({ ...defaultOptions, iconUrl: OverspanningIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: OverspanningSelectIcon }),
  },
  [GEVEL_ARMATUUR]: {
    default: L.icon({ ...defaultOptions, iconUrl: GevelArmatuurIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: GevelArmatuurSelectIcon }),
  },
  [GRACHTMAST]: {
    default: L.icon({ ...defaultOptions, iconUrl: GrachtmastIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: GrachtmastSelectIcon }),
  },
  [OVERIG]: {
    default: L.icon({ ...defaultOptions, iconUrl: OverigIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: OverigSelectIcon }),
  },
  [SCHIJNWERPER]: {
    default: L.icon({ ...defaultOptions, iconUrl: SchijnwerperIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: SchijnwerperSelectIcon }),
  },
}

export const getOVLIcon = (typeName, isSelected) => {
  let iconSet = OVL_MAPPING[typeName]
  if (!iconSet) {
    console.error(`icon missing for type, using default. Type is: ${typeName}`) // eslint-disable-line no-console
    iconSet = OVL_MAPPING[Object.keys(OVL_MAPPING)[0]]
  }

  if (isSelected) {
    return iconSet.selected
  }

  return iconSet.default
}

export const LEGEND_ITEMS = [
  { key: 'klok', label: 'Klok', iconUrl: KlokIcon },
  { key: 'grachtmast', label: 'Grachtmast', iconUrl: GrachtmastIcon },
  { key: 'overspanning', label: 'Lamp aan kabel', iconUrl: OverspanningIcon },
  {
    key: 'gevel_armatuur',
    label: 'Lamp aan gevel',
    iconUrl: GevelArmatuurIcon,
  },
  { key: 'schijnwerper', label: 'Schijnwerper', iconUrl: SchijnwerperIcon },
  { key: 'overig_lichtpunt', label: 'Overig lichtpunt', iconUrl: OverigIcon },
  { key: 'is_gemeld', label: 'Is gemeld', iconUrl: IsReportedIcon },
]
