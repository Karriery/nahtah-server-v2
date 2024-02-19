const UserService = require("../../../service/userService.js");

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
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        var User = req.body;
        User.password = hash;
        var a = await UserService.signup(User);
        res.send({ msg: true });
      });
    } catch {
      res.send("get error ");
    }
  },
  async login(req, res) {
    try {
      var User = await UserService.getUserByUsername(req.body.username);
      if (User) {
        bcrypt.compare(req.body.password, User.password, (err, result) => {
          if (result) {
            var token = jwt.sign({ id: User._id }, "sa7fa leblebi");
            var access_token = jwt.sign({ id: User._id }, "halelews");
            res.send({ token, access_token, user: User });
            res.send({ msg: "success" });
          } else {
            res.send({ msg: "wrong password" });
          }
        });
      } else {
        res.send({ msg: "wrong User name" });
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
