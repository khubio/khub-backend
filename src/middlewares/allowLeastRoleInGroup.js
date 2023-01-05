const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { userGroupService } = require('../services');

const restrictRoles = {
  member: ['member', 'coOwner', 'owner'],
  coOwner: ['coOwner', 'owner'],
  owner: ['owner'],
};

const allowLeastRoleInGroup =
  (role = 'member') =>
  async (req, res, next) => {
    const { _id: userId } = req.user;
    const { groupId } = req.params;
    const isAccepted = await userGroupService.requiredRoleInGroup(userId, groupId, restrictRoles[role]);
    if (!isAccepted) {
      next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    } else {
      next();
    }
  };

module.exports = allowLeastRoleInGroup;
