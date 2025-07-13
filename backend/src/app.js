const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const auth_routes = require("./routes/auth.routes");
const users_routes = require("./routes/users.routes");
const complaint_routes = require("./routes/complaint.routes");
const response_routes = require("./routes/response.routes");
const attachment_routes = require("./routes/attachment.routes");
const analytics_routes = require("./routes/analytics.routes");

const { validateToken } = require("../src/middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", auth_routes);
app.use("/users", validateToken, users_routes);
app.use("/complaint", validateToken, complaint_routes);
app.use("/response", validateToken, response_routes);
app.use("/attachments", validateToken, attachment_routes);
app.use("/uploads", express.static("uploads"));
app.use("/analytics", analytics_routes);

module.exports = app;
