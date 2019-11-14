const formatRoles = items => {
  const roles = [];
  items.forEach(role => {
    let permissions = '';

    role.permissions.forEach(permission => {
      permissions = `${permissions + permission._display} `;
    });

    roles.push({
      id: role.id,
      Naam: role._display,
      Rechten: permissions,
    });
  });

  return roles;
};

export default formatRoles;