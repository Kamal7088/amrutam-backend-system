const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const pool = require("../config/db");
const audit = require("../middleware/audit.middleware");

router.post("/", auth(["PATIENT"]), async (req, res) => {
  const key = req.headers["idempotency-key"];
  if (!key) return res.status(400).json({ message: "Idempotency-Key required" });

  const exists = await pool.query(
    "SELECT * FROM payments WHERE idempotency_key=$1",
    [key]
  );

  if (exists.rowCount) {
    return res.json({ message: "Already processed" });
  }

  const { slot_id } = req.body;

  const consult = await pool.query(
    "INSERT INTO consultations(slot_id,patient_id,status) VALUES($1,$2,'BOOKED') RETURNING *",
    [slot_id, req.user.id]
  );

  await pool.query(
    "INSERT INTO payments(consultation_id,idempotency_key) VALUES($1,$2)",
    [consult.rows[0].id, key]
  );

  await audit(req.user.id, "BOOK_CONSULTATION", "consultations");
  res.json(consult.rows[0]);
});

module.exports = router;
