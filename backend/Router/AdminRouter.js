
const express = require("express");

const router = express.Router();

const {

  createAdminData,

  getAdminData,

  getAdminDataById,

  updateAdminData,

  deleteAdminData,

} = require("../controllers/AdminController");


router.post("/", createAdminData);



router.get("/", getAdminData);



router.get("/:id", getAdminDataById);



router.put("/:id", updateAdminData);



router.delete("/:id", deleteAdminData);

module.exports = router; 