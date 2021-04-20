// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
const formatRoles = (items) => {
  const roles = []
  items.forEach((role) => {
    const permissions = []

    role.permissions.forEach((permission) => {
      permissions.push(permission.name)
    })

    roles.push({
      id: role.id,
      Naam: role.name,
      Rechten: permissions.join(', '),
    })
  })

  return roles
}

export default formatRoles
