
const { ForbiddenError } = require("../errors");

// allowedRoles = array of roles allowed for the route
const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied: insufficient permissions" });
    }

    next();
  };
};

module.exports = allowRoles;
