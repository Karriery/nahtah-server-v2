var User = require("../model/user.js");

module.exports = new (class UserService {
  signup(data) {
    return User.create(data);
  }
  getUserById(id) {
    return User.findOne({ _id: id });
  }
  getUserByUsername(username) {
    return User.findOne({ username: username });
  }
  getUserbyEmail(email) {
    return User.findOne({ email: email });
  }
  getAllUser() {
    return User.find();
  }
  delete(id) {
    return User.findOneAndDelete({ _id: id });
  }

  update(_id, data) {
    return User.findOneAndUpdate({ _id: _id }, data);
  }
  filterBanned(data) {
    return User.find({ banned: data });
  }
})();
