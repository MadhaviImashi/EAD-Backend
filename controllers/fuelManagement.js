const User = require('../models/user');
const FuelShed = require('../models/fuelShed');

//method: get station details by stationId
const getFuelStationDetails = async (req, response) => {
    const station_id = req.body.station_id;

    try {
        const fuelShed = await FuelShed.findById(station_id)
            .populate({ path: "Diesel.busQueue" })
            .populate({ path: "Diesel.threeWheelerQueue" })
            .populate({ path: "Petrol.carQueue" })
            .populate({ path: "Petrol.bikeQueue" })
            .populate({ path: "Petrol.threeWheelerQueue" })
            .exec(() => (err,result)= {});
        response.status(200).json({
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
const updateFuelStationDetails = async(req, res) = {
    
}

//method: Search fuel station (get all details of searched StationId)
const getDetailsOfSearchedFuelStation = async (req, response) => {
    const searched_station_id = req.body.station_id;

    try {
        const fuelShed = await FuelShed.findById(searched_station_id)
            .populate({ path: "Diesel.busQueue" })
            .populate({ path: "Diesel.threeWheelerQueue" })
            .populate({ path: "Petrol.carQueue" })
            .populate({ path: "Petrol.bikeQueue" })
            .populate({ path: "Petrol.threeWheelerQueue" })
            .exec(() => (err,result)= {});
        response.status(200).json({
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
const addUserToFuelQueue = async (req, response) => {
//find the user who is going to join the queue, the station
    const user_id = req.body.user_id;
    const station_id = req.body.station_id;
    let user, station;
    try {
        user = await User.findById(user_id);
        station = await FuelShed.findById(station_id);
    }
    catch (error) {
        console.log(error, 'matching user or station not found');
    }

//find the correct category to which user belongs to
    const fuelType = req.body.fuelType; // 'Diesel' or 'Petrol'
    const vehicalType = req.body.vehicalType // 'bus' / 'threeWheeler' / 'car' / 'bike' 
    let queueType;

    if (fuelType === 'Diesel') {
        switch (vehicalType) {
            case 'bus':
                queueType = station.Diesel.busQueue;
                break;
            case 'threewheeler':
                queueType = station.Diesel.threeWheelerQueue;
                break;
            default:
                break;
        }
    } else if (fuelType === 'Petrol') {
        switch (vehicalType) {
            case 'bus':
                queueType = station.Petrol.busQueue;
                break;
            case 'threewheeler':
                queueType = station.Petrol.threeWheelerQueue;
                break;
            case 'bike':
                queueType = station.Petrol.bikeQueue;
            default:
                break;
        }
    }

//add the user to the correct queue
    try {
        queueType.push(user);
        station.save()
            .then((res) => {
                console.log('user added to queue successfully');
                response.status(200).json({
                    success: true,
                    message: "user added to correct queue successfully",
                    data: res,
                })
                    .catch((err) => {
                        console.log(err, "couldn't add user to the fuel queue");
                })
        })
    }
    catch (err) {
        console.log(err, "couldn't add user to the fuel queue")
    }
}
//method: get the lenght of each queue (lenght of queue array)
//method: get waiting time of each queue (ex: stationId.petrol.carQueue[0].arrivalTime)

//method: get fuel avaiablity of each fuel type
//method: remove user from correct queue
//method: exit after fueling

const all = {
    getFuelStationDetails,
    getDetailsOfSearchedFuelStation,
    updateFuelStationDetails,
    addUserToFuelQueue,
}

module.exports = all;