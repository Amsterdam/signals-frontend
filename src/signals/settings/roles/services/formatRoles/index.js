const formatRoles = items => {
  const roles = [];
  items.forEach(role => {
    const permissions = [];

    role.permissions.forEach(permission => {
      permissions.push(permission._display);
    });

    roles.push({
      id: role.id,
      Naam: role._display,
      Rechten: permissions.join(', '),
    });
  });

  return roles;
};

export default formatRoles;