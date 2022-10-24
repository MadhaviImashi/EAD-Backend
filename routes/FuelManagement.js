const express = require("express");
const router = express.Router();
const fuelManager = require("../controllers/fuelManagement");

router.get("/", fuelManager.getFuelStationDetails);
router.get("/search", fuelManager.getDetailsOfSearchedFuelStation);
router.put("/", fuelManager.updateFuelStationDetails);
router.post("/add-to-queue", fuelManager.addUserToFuelQueue);
module.exports = router;