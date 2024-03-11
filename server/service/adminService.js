var Admin = require("../model/admin.js");

module.exports = new (class AdminService {
  signup(data) {
    return Admin.create(data);
  }
  getAdminById(id) {
    return Admin.findOne({ _id: id });
  }
  getAdminByUsername(username) {
    return Admin.findOne({ username: username });
  }
  getAdminbyEmail(email) {
    return Admin.findOne({ email: email });
  }
  getAllAdmin() {
    return Admin.find();
  }
  delete(id) {
    return Admin.findOneAndDelete({ _id: id });
  }

  update(_id, data) {
    return Admin.findOneAndUpdate({ _id: _id }, data);
  }
})();
