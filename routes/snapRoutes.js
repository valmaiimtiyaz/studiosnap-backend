const express = require("express");
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  login,
  startPhotoSession,
  endPhotoSession,
  getFilters,
  submitFeedback,
} = require("../controllers/snapControllers");

const router = express.Router();

router.post("/login", login);
router.post("/register", addUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/start-session", startPhotoSession);
router.post("/end-session", endPhotoSession);
router.get("/filters", getFilters);
router.post("/feedback", submitFeedback);

module.exports = router;
