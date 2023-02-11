const jwt = require("jsonwebtoken");
var createError = require("http-errors");
const adminService = require("./service/adminService.js");

module.exports = {
  verifyAccessToken: (roles) => (req, res, next) => {
    // return;
    if (!req.header("authorization")) {
      return next(createError.Unauthorized());
    }
    var token = req.header("authorization").split(" ")[1];
    jwt.verify(token, "halelews", async (err, p) => {
      if (err) {
        return next(createError.Unauthorized());
      } else {
        var admin = (await adminService.getAdminById(p.id)) || {};
        if (roles.includes(admin.type)) {
          req.payload = p;
          next();
        } else {
          return next(createError.Unauthorized());
        }
      }
    });
  },
};
