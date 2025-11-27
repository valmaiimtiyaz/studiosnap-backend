const express = require("express");
const {
  getAllUsers,
  getUserById,
  addUser, 
  updateUser,
  deleteUser,
} = require("../controllers/snapControllers");

const router = express.Router();

router.post("/register", addUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
