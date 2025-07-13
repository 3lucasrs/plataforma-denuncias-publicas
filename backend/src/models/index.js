const sequelize = require("../config/db");

const User = require("./User.model");

const Complaint = require("./Complaint.model");
const Response = require("./Response.model");
const Attachment = require("./Attachment.model");

// === Associações ===

// 1 User => N Complaint
User.hasMany(Complaint, { foreignKey: "userId" });
Complaint.belongsTo(User, { foreignKey: "userId" });

// 1 Complaint => N Response
Complaint.hasMany(Response, { foreignKey: "complaintId" });
Response.belongsTo(Complaint, { foreignKey: "complaintId" });

// 1 User => N Response
User.hasMany(Response, { foreignKey: "userId" });
Response.belongsTo(User, { foreignKey: "userId" });

// 1 Complaint => N Attachment
Complaint.hasMany(Attachment, { foreignKey: "complaintId" });
Attachment.belongsTo(Complaint, { foreignKey: "complaintId" });

module.exports = {
  sequelize,
  User,
  Complaint,
  Response,
  Attachment,
};
