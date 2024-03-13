const UserService = require("../../../service/userService.js");
const AdminService = require("../../../service/adminService.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async getUsers(req, res, next) {
    try {
      var Users = await UserService.getAllUser();
      res.send(Users);
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async delet(req, res, next) {
    try {
      var Users = await UserService.delete(req.params.id);
      res.send({ msg: "deleted" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async update(req, res, next) {
    try {
      var Users = await UserService.update(req.params.id, req.body);
      res.send({ msg: "updated" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async getUsers(req, res, next) {
    try {
      var Users = await UserService.getAllUser();
      res.send(Users);
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async signUpUser(req, res) {
    try {
      // res.send(req.body);
      if (!req.body.password || !req.body.username) {
        res.send({ msg: false });
      }
      const user = await UserService.getUserbyEmail(req.body.email);
      if (user) {
        res.send({ msg: "email already exist" });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          var User = req.body;
          User.password = hash;
          var newUser = await UserService.signup(User);
          var token = jwt.sign({ id: newUser._id }, "sa7fa leblebi");
          var accessToken = jwt.sign({ id: newUser._id }, "halelews");
          res.send({
            msg: true,
            token,
            access_token: accessToken,
            user: newUser,
          });
        });
      }
    } catch {
      res.send("get error ");
    }
  },
  async login(req, res) {
    try {
      var Admin = await AdminService.getAdminByUsername(req.body.username);
      var User;

      if (!Admin) {
        User = await UserService.getUserByUsername(req.body.username);
      }

      const user = Admin || User;

      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            var token = jwt.sign({ id: user._id }, "sa7fa leblebi");
            var access_token = jwt.sign({ id: user._id }, "halelews");
            res.send({ token, access_token, user });
          } else {
            res.send({ msg: "wrong password" });
          }
        });
      } else {
        res.send({ msg: "wrong User name" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.send("Error during login");
    }
  },

  async verify(req, res) {
    try {
      if (!req.body.token) {
        res.send({ msg: false });
      }
      var objId = jwt.verify(req.body.token, "sa7fa leblebi");
      var User = await UserService.getUserById(objId.id);
      if (User) {
        res.send(User);
      } else {
        res.send({ msg: false });
      }
    } catch {
      res.send("get error ");
    }
  },
};
