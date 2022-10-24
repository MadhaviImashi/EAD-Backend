const User = require('../models/user');
const FuelShed = require('../models/fuelShed');

//method: get station details by stationId
const getFuelStationDetails = async (req, response) => {
    const station_id = req.body.station_id;

    try {
        const fuelShed = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue" )
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue")
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
const updateFuelStationDetails = async(req, res) => {
    
}

//method: Search fuel station (get all details of searched StationId)
const getDetailsOfSearchedFuelStation = async (req, response) => {
    const searched_station_id = req.body.station_id;

    try {
        const fuelShed = await FuelShed.findById(searched_station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue")
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
                    updatedStation: res,
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
const getFuelQueueLengths = async (req, response) => {
    //find the station
    const station_id = req.body.station_id;
    let station;
    try {
        station = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue")
            .exec(() => (err,result)= {});
        //calculate lengths of each fuel queue
        let queueLengths = {
            "diesel_bus_queue_length": station.Diesel.busQueue.length,
            "diesel_threeWheeler_queue_length": station.Diesel.threeWheelerQueue.length,
            "petrol_car_queue_length": station.Petrol.threeWheelerQueue.length,
            "petrol_bike_queue_length": station.Petrol.carQueue.length,
            "petrol_threeWheeler_queue_length": station.Petrol.bikeQueue.length,
        }
        response.status(200).json({
            success: true,
            queueLengths
        })
    }
    catch (error) {
        console.log(error, "couldn't retrieve fuel queue lengths");
    }
}
//method: get waiting time of each queue (ex: stationId.petrol.carQueue[0].arrivalTime)
const getQueueWaitingTimes = async (req, response) => {
    const station_id = req.body.station_id;
    let station;
    try {
        //find the station
        station = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue")
            .exec(() => (err,result)= {});
        //find waiting times of each queue (the arrival time of the person who is about to obtain fuel(who is at the front of the queue))
        let waitingTimes = {
            "w_time_for_diesel_bus_queue": station.Diesel.busQueue[0].joinedTime,
            "w_time_for_diesel_threewheeler_queue": station.Diesel.threeWheelerQueue[0].joinedTime,
            "w_time_for_petrol_car_queue": station.Petrol.carQueue[0].joinedTime,
            "w_time_for_petrol_bike_queue": station.Petrol.bikeQueue[0].joinedTime,
            "w_time_for_petrol_threewheeler_queue": station.Petrol.threeWheelerQueue[0].joinedTime,
        }
        response.status(200).json({
            success: true,
            waitingTimes
        })
    }
    catch (err) {
        console.log(err, "couldn't retrieve fuel queue waiting times");
    }
}
//method: get fuel avaiablity of each fuel type
//method: remove user from correct queue
//method: exit after fueling

const all = {
    getFuelStationDetails,
    getDetailsOfSearchedFuelStation,
    updateFuelStationDetails,
    addUserToFuelQueue,
    getFuelQueueLengths,
    getQueueWaitingTimes,
}

module.exports = all;