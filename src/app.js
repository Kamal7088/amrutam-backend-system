const express = require("express");
const helmet = require("helmet");
const rateLimiter = require("./middleware/rateLimit.middleware");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(rateLimiter);

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/doctor", require("./routes/doctor.routes"));
app.use("/book", require("./routes/booking.routes"));
app.use("/prescription", require("./routes/prescription.routes"));
app.use("/admin", require("./routes/admin.routes"));

module.exports = app;
