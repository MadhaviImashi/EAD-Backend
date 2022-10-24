const express = require("express");
const router = express.Router();
const fuelManager = require("../controllers/fuelManagement");

router.get("/", fuelManager.getFuelStationDetails);
router.get("/search-station", fuelManager.getIdByFuelStationName);
router.get("/station-details", fuelManager.getDetailsOfSearchedFuelStation);
router.post("/update", fuelManager.updateFuelStationDetails);
router.post("/add-to-queue", fuelManager.addUserToFuelQueue);
router.get("/q-lengths", fuelManager.getFuelQueueLengths);
router.get("/q-waiting-times", fuelManager.getQueueWaitingTimes);
module.exports = router;