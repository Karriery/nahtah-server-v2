const adminService = require("../../../service/adminService.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
  async getAdmins(req, res, next) {
    try {
      var Admins = await adminService.getAllAdmin();
      res.send(Admins);
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async delet(req, res, next) {
    try {
      var Admins = await adminService.delete(req.params.id);
      res.send({ msg: "deleted" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async update(req, res, next) {
    try {
      var Admins = await adminService.update(req.params.id, req.body);
      res.send({ msg: "updated" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async getAdmins(req, res, next) {
    try {
      var Admins = await adminService.getAllAdmin();
      res.send(Admins);
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async signUpadmin(req, res) {
    try {
      // res.send(req.body);
      if (!req.body.password || !req.body.username) {
        res.send({ msg: false });
      }
      const admin = await adminService.getAdminbyEmail(req.body.email);
      if (admin) {
        res.send({ msg: "email already exist" });
      }
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        var admin = req.body;
        admin.password = hash;
        var a = await adminService.signup(admin);
        res.send({ msg: true });
      });
    } catch {
      res.send("get error ");
    }
  },
  async login(req, res) {
    try {
      var admin = await adminService.getAdminByUsername(req.body.username);
      if (admin) {
        bcrypt.compare(req.body.password, admin.password, (err, result) => {
          if (result) {
            var token = jwt.sign({ id: admin._id }, "sa7fa leblebi");
            var access_token = jwt.sign({ id: admin._id }, "halelews");
            res.send({ token, access_token });
          } else {
            res.send({ msg: "wrong password" });
          }
        });
      } else {
        res.send({ msg: "wrong admin name" });
      }
    } catch {
      res.send("get error ");
    }
  },
  async verify(req, res) {
    try {
      if (!req.body.token) {
        res.send({ msg: false });
      }
      var objId = jwt.verify(req.body.token, "sa7fa leblebi");
      var admin = await adminService.getAdminById(objId.id);
      if (admin) {
        res.send(admin);
      } else {
        res.send({ msg: false });
      }
    } catch {
      res.send("get error ");
    }
  },
};
