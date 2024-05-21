const UserService = require("../../../service/userService.js");
const AdminService = require("../../../service/adminService.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  name: "nahtah.com",
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "contact@nahtah.com",
    pass: "Nahtah2024!",
  },
});

module.exports = {
  async sendMail(req, res, next) {
    try {
      const { email } = req.body;
      let user;
      let code, expiration;
      const admin = await AdminService.getAdminbyEmail(email);
      if (admin) {
        code = crypto.randomBytes(4).toString("hex");
        expiration = Date.now() + 300000;
        await AdminService.updateResetCode(email, code, expiration);
      } else {
        user = await UserService.getUserbyEmail(email);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        code = crypto.randomBytes(4).toString("hex");
        expiration = Date.now() + 300000;
        await UserService.updateResetCode(email, code, expiration);
      }
      if (!user && !admin) {
        return res.status(404).json({ message: "User not found" });
      }
      const info = await transporter.sendMail({
        from: "Nahtah Coiffeur ",
        to: email,
        subject: "إعادة تعيين كلمة المرور",
        text: `رمز إعادة تعيين كلمة المرور الخاص بك هو: ${code}`,
        html: `<p>رمز إعادة تعيين كلمة المرور الخاص بك هو: <strong>${code}</strong>
          <br>سينتهي هذا الرمز في 5 دقائق</p>`,
      });

      console.log("Message sent: %s", info.messageId);
      res
        .status(200)
        .json({ message: "Password reset email sent", code, expiration });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    }
  },
  async validateCode(req, res, next) {
    try {
      const { email, code } = req.body;
      let isValid = false;
      const admin = await AdminService.getAdminbyEmail(email);

      if (admin) {
        const sentExpiration = parseInt(admin.expiration);
        if (admin.ResetCode === code && Date.now() < sentExpiration) {
          isValid = true;
        }
      } else {
        const user = await UserService.getUserbyEmail(email);
        if (user) {
          const sentExpiration = parseInt(user.expiration);
          if (user.ResetCode === code && Date.now() < sentExpiration) {
            isValid = true;
          }
        }
      }
      if (isValid) {
        res.status(200).json({ valid: true });
      } else {
        res.send({ valid: false, message: "Invalid code" });
      }
    } catch (error) {
      console.error("Error validating code:", error);
      res.status(500).json({ error: "Error validating code" });
    }
  },
  async resetPassword(req, res, next) {
    try {
      const { email, password } = req.body;
      const admin = await AdminService.getAdminbyEmail(email);
      if (admin) {
        bcrypt.hash(password, 10, async (err, hash) => {
          await AdminService.updatePassword(email, hash);
        });
      } else {
        const user = await UserService.getUserbyEmail(email);
        if (user) {
          bcrypt.hash(password, 10, async (err, hash) => {
            await UserService.updatePassword(email, hash);
          });
        } else {
          res.status(404).json({ error: "User not found" });
          return;
        }
      }
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Error updating password" });
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
  async delet(req, res, next) {
    try {
      var Users = await UserService.delete(req.params.id);
      res.send({ msg: "deleted" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async filterBanned(req, res, next) {
    try {
      var Users = await UserService.filterBanned(req.body.banned);
      let { page, limit } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 7;

      const skip = (page - 1) * limit;
      const paginatedUsers = Users.slice(skip, skip + limit);
      const totalUsers = Users.length;
      const TotalUsersInCurrentPage = paginatedUsers.length;
      const totalPages = Math.ceil(totalUsers / limit);
      res.send({
        Users: paginatedUsers,
        totalUsers,
        totalPages,
        TotalUsersInCurrentPage,
      });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async getUsersAndAdminsByPhone(req, res, next) {
    try {
      const { phone } = req.body;
      const Users = await UserService.getByPhone(phone);
      const Admins = await AdminService.getAdminByPhone(phone);
      if (Users.length > 0) {
        res.send({ Users });
      } else if (Admins.length > 0) {
        res.send({ Admins });
      } else {
        res.send({ msg: "not found" });
      }
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async getUserByPhone(req, res, next) {
    try {
      const Users = await UserService.getByPhone(req.body.phone);
      if (Users) {
        res.send({ Users });
      } else {
        res.send({ msg: "not found" });
      }
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
  async update(req, res, next) {
    try {
      var admin = await AdminService.getAdminById(req.params.id);
      var user = await UserService.getUserById(req.params.id);

      if (admin) {
        var updatedAdmin = await AdminService.update(req.params.id, req.body);
        res.send({ msg: "updated", admin: updatedAdmin });
      } else if (user) {
        var updatedUser = await UserService.update(req.params.id, req.body);
        res.send({ msg: "updated", user: updatedUser });
      } else {
        res.status(404).json({ msg: "not found" });
      }
    } catch (error) {
      next(error);
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
  async getUserById(req, res, next) {
    try {
      var Users = await UserService.getUserById(req.params.id);
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
      var Admin = await AdminService.getAdminbyEmail(req.body.email);
      var User;

      if (!Admin) {
        User = await UserService.getUserbyEmail(req.body.email);
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
