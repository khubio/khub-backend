const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

const groupAllRoles = {
  owner: ['getMembers', 'manageMembers'],
  coOwner: ['getMembers'],
  member: ['getMembers'],
  blacklist: [],
};

const roles = Object.keys(allRoles);
const groupRoles = Object.keys(groupAllRoles);
const roleRights = new Map(Object.entries(allRoles));
const groupRolesRights = new Map(Object.entries(groupAllRoles));

module.exports = {
  roles,
  roleRights,
  groupRoles,
  groupRolesRights,
};
