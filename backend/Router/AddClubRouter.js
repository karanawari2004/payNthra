const express = require("express");
const router = express.Router();

const {
  createClub,
  getAllClubs,
  deleteClub,
  updateClub,
} = require("../controllers/AddClubController");

router.post("/", createClub);
router.get("/", getAllClubs);
router.delete("/:id", deleteClub);




router.put("/:id", (req, res, next) => {
  console.log("UPDATE CLUB ROUTE HIT");
  console.log("Club ID:", req.params.id);
  next();
}, updateClub);
module.exports = router;