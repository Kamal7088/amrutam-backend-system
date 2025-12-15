const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const pool = require("../config/db");
const audit = require("../middleware/audit.middleware");

router.post("/slots", auth(["DOCTOR"]), async (req, res) => {
  const { start_time, end_time } = req.body;
  await pool.query(
    "INSERT INTO availability_slots(doctor_id,start_time,end_time) VALUES($1,$2,$3)",
    [req.user.id, start_time, end_time]
  );
  await audit(req.user.id, "CREATE_SLOT", "availability_slots");
  res.json({ message: "Slot created" });
});

module.exports = router;
