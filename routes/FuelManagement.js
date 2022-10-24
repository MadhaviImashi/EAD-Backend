const express = require("express");
const router = express.Router();
const fuelManager = require("../controllers/fuelManagement");

router.get("/", fuelManager.getFuelStationDetails);
router.get("/search", fuelManager.getDetailsOfSearchedFuelStation);

module.exports = router;