const express = require("express");
const router = express.Router();

const {
  createClub,
  getAllClubs,
  deleteClub,
} = require("../controllers/AddClubController");

router.post("/", createClub);
router.get("/", getAllClubs);
router.delete("/:id", deleteClub);

module.exports = router;