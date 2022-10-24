const User = require('../models/user');
const FuelShed = require('../models/fuelShed');

//method: get station details by stationId
const getFuelStationDetails = async (req, res) => {
    const station_id = req.body.id;

    try {
        const fuelShed = await FuelShed.findById(station_id)
            .populate({ path: "Diesel.busQueue" })
            .populate({ path: "Diesel.threeWheelerQueue" })
            .populate({ path: "Petrol.carQueue" })
            .populate({ path: "Petrol.bikeQueue" })
            .populate({ path: "Petrol.threeWheelerQueue" })
            .exec(() => (err,result)= {});
        res.status(200).json({
            success: true,
            message: "GET station details",
            fuelShed: fuelShed
        })
    }
    catch (err) {
        console.log(err);
    }
}

//method: update fuel details of a particular station

//method: Search fuel station (get all details of searched StationId)
const getDetailsOfSearchedFuelStation = async (req, res) => {
    const searched_station_id = req.body.id;

    try {
        const fuelShed = await FuelShed.findById(searched_station_id)
            .populate({ path: "Diesel.busQueue" })
            .populate({ path: "Diesel.threeWheelerQueue" })
            .populate({ path: "Petrol.carQueue" })
            .populate({ path: "Petrol.bikeQueue" })
            .populate({ path: "Petrol.threeWheelerQueue" })
            .exec(() => (err,result)= {});
        res.status(200).json({
            success: true,
            message: "GET station details",
            fuelShed: fuelShed
        })
    }
    catch (err) {
        console.log(err);
    }
}
//method: add user to the correct queue(ex: stationId.petrol.carQueue.push(user))

//method: get the lenght of each queue (lenght of queue array)
//method: get waiting time of each queue (ex: stationId.petrol.carQueue[0].arrivalTime)

//method: get fuel avaiablity of each fuel type
//method: remove user from correct queue
//method: exit after fueling

const all = {
    getFuelStationDetails,
    getDetailsOfSearchedFuelStation,
}

module.exports = all