const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users(email,password_hash,role) VALUES($1,$2,$3)",
    [email, hash, role]
  );
  res.json({ message: "Registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = (await pool.query(
    "SELECT * FROM users WHERE email=$1", [email]
  )).rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

module.exports = router;
