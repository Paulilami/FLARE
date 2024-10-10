const config = require('../../config/default.json');

const roleRatios = {
  search: config.droneRoles.search,
  front: config.droneRoles.front,
  back: config.droneRoles.back,
};

const assignRoles = (droneList) => {
  const totalDrones = droneList.length;
  const searchCount = Math.floor((roleRatios.search / 100) * totalDrones);
  const frontCount = Math.floor((roleRatios.front / 100) * totalDrones);
  const backCount = totalDrones - searchCount - frontCount;

  return droneList.map((drone, index) => {
    if (index < searchCount) return { id: drone.id, role: 'search' };
    if (index < searchCount + frontCount) return { id: drone.id, role: 'front' };
    return { id: drone.id, role: 'back' };
  });
};

const updateRoleRatios = (newRatios) => {
  roleRatios.search = newRatios.search || roleRatios.search;
  roleRatios.front = newRatios.front || roleRatios.front;
  roleRatios.back = 100 - roleRatios.search - roleRatios.front;
};

module.exports = { assignRoles, updateRoleRatios, roleRatios };
