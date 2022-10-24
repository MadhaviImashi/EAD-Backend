const User = require('../models/user');
const FuelShed = require('../models/fuelShed');
const { findOneAndUpdate, update } = require('../models/user');

//method: get station details by stationId
const getFuelStationDetails = async (req, response) => {
    const station_id = req.body.station_id;

    try {
        const fuelShed = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue" )
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue");
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
const updateFuelStationDetails = async(req, response) => {
    const station_id = req.body.station_id;
    const DieselArrivalTime = req.body.diesel_arrival_time;
    const DieselArrivedQuantity = req.body.diesel_arrived_quantity;
    const DieselFinishingTime = req.body.diesel_finishing_time;
    const PetrolArrivalTime = req.body.petrol_arrival_time;
    const PetrolArrivedQuantity = req.body.petrol_arrived_quantity;
    const PetrolFinishingTime = req.body.petrol_finishing_time;

    try {
        //update total avaiable fuel quantity
        let StationBeforeUpdate = await FuelShed.findById(station_id);
        let availableDieselQnt, availablePetrolQnt = 0;
        availableDieselQnt = StationBeforeUpdate.Diesel.avaiableTotalFuelAmount;
        availablePetrolQnt = StationBeforeUpdate.Petrol.avaiableTotalFuelAmount;

        const totalDieselQuantity = availableDieselQnt + req.body.diesel_arrived_quantity;
        const totalPetrolQuantity = availablePetrolQnt + req.body.petrol_arrived_quantity;
        console.log('totDiesel', 'totPetrol', totalDieselQuantity, totalPetrolQuantity)
        
        //find the station
        let station = await FuelShed.findOneAndUpdate({ station_id }
        ,{
            "Diesel.arrivalTime": DieselArrivalTime,
            "Diesel.arrivedQuantity": DieselArrivedQuantity,
            "Diesel.finishingTime": DieselFinishingTime,
            "Diesel.avaiableTotalFuelAmount": totalDieselQuantity,
            "Petrol.arrivalTime": PetrolArrivalTime,
            "Petrol.arrivedQuantity": PetrolArrivedQuantity,
            "Petrol.finishingTime": PetrolFinishingTime,
            "Petrol.avaiableTotalFuelAmount": totalPetrolQuantity
            }).exec();
        let updatedFuelStation = await FuelShed.findById(station_id);
        response.status(200).json({
            success: true,
            message: "UPDATE station details",
            updatedFuelStation: updatedFuelStation
        })
    }
    catch (err) {
        console.log(err);
    }    
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
            .populate("Petrol.threeWheelerQueue");
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

//track the time that user joined the queue
    let t = new Date();
    let currentTime = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
    user.joinedTime = currentTime;
    await user.save();

//find the correct category to which user belongs to & add user to the queue
    const fuelType = req.body.fuel_type; // 'Diesel' or 'Petrol'
    const vehicalType = req.body.vehical_type; // 'bus' / 'threeWheeler' / 'car' / 'bike' 
    let queueType;
    console.log('fuel, vehical: ', fuelType, vehicalType);

    if (fuelType === 'Diesel') {
        switch (vehicalType) {
            case 'bus':
                station.Diesel.busQueue.push(user);
                break;
            case 'threeWheeler':
                station.Diesel.threeWheelerQueue.push(user);
                break;
            default:
                break;
        }
    } else if (fuelType === 'Petrol') {
        switch (vehicalType) {
            case 'car':
                station.Petrol.carQueue.push(user);
                break;
            case 'threeWheeler':
                station.Petrol.threeWheelerQueue.push(user);
                break;
            case 'bike':
                station.Petrol.bikeQueue.push(user);
            default:
                break;
        }
    }

//save the modified station details
    try {
        station.save()
            .then((res) => {
                console.log('user added to queue successfully');
                response.status(200).json({
                    success: true,
                    message: "user added to correct queue successfully",
                    updatedStation: station,
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
            .populate("Petrol.threeWheelerQueue");
        //calculate lengths of each fuel queue
        let queueLengths = {
            "diesel_bus_queue_length": station.Diesel.busQueue.length,
            "diesel_threeWheeler_queue_length": station.Diesel.threeWheelerQueue.length,
            "petrol_car_queue_length": station.Petrol.carQueue.length,
            "petrol_bike_queue_length": station.Petrol.bikeQueue.length,
            "petrol_threeWheeler_queue_length": station.Petrol.threeWheelerQueue.length,
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
            .populate("Petrol.threeWheelerQueue");
        
        //find waiting times of each queue (the arrival time of the person who is about to obtain fuel(who is at the front of the queue))
        let t = new Date();
        let currentTime = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();

        let waitingTimes = {
            "currentTime": currentTime,
            "w_time_for_diesel_bus_queue": (station.Diesel.busQueue.length > 0)? station.Diesel.busQueue[0].joinedTime: '00:00:00',
            "w_time_for_diesel_threewheeler_queue": (station.Diesel.threeWheelerQueue.length > 0)? station.Diesel.threeWheelerQueue[0].joinedTime: '00:00:00',
            "w_time_for_petrol_car_queue": (station.Petrol.carQueue.length > 0)? station.Petrol.carQueue[0].joinedTime: '00:00:00',
            "w_time_for_petrol_bike_queue": (station.Petrol.bikeQueue.length > 0)? station.Petrol.bikeQueue[0].joinedTime: '00:00:00',
            "w_time_for_petrol_threewheeler_queue": (station.Petrol.threeWheelerQueue.length > 0)? station.Petrol.threeWheelerQueue[0].joinedTime: '00:00:00',
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
//method: get fuel avaiablity of each fuel type of the respective fuel station
const getFuelAvailability = async (req, response) => {
    const station_id = req.body.station_id;
    let station;
    try {
        //find the station
        station = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue");
        
        //check availability of each fuel type
        let petrolStatus = (station.Petrol.avaiableTotalFuelAmount > 0) ? true : false;
        let dieselStatus = (station.Diesel.avaiableTotalFuelAmount > 0) ? true : false;

        response.status(200).json({
            success: true,
            petrolStatus,
            dieselStatus
        })
    }
    catch (err) {
        console.log(err, "couldn't fetch fuel avaiability details");
    }
}
//method: remove user from correct queue
const exitUserFromFuelQueue = async (req, response) => {
//find the user who is going to join the queue, the station
    const user_id = req.body.user_id;
    const station_id = req.body.station_id;
    console.log('u-id, station-id,', user_id, station_id);
    let user, station;
    try {
        user = await User.findById(user_id);
        station = await FuelShed.findById(station_id);
    }
    catch (error) {
        console.log(error, 'matching user or station not found');
    }

//track the time that user exit the queue
    let t = new Date();
    let currentTime = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
    user.exitTime = currentTime;
    await user.save();

//find the correct category to which user belongs to & add user to the queue
    const fuelType = req.body.fuel_type; // 'Diesel' or 'Petrol'
    const vehicalType = req.body.vehical_type; // 'bus' / 'threeWheeler' / 'car' / 'bike' 
    let queueType;
    console.log('fuel, vehical: ', fuelType, vehicalType);

    if (fuelType === 'Diesel') {
        switch (vehicalType) {
            case 'bus':
                //find where in the bus-queue this user is
                array.forEach(element => {
                    
                });
                station.Diesel.busQueue.push(user);
                break;
            case 'threeWheeler':
                station.Diesel.threeWheelerQueue.push(user);
                break;
            default:
                break;
        }
    } else if (fuelType === 'Petrol') {
        console.log('inside else if')
        switch (vehicalType) {
            case 'car':
                station.Petrol.carQueue.push(user);
                break;
            case 'threeWheeler':
                station.Petrol.threeWheelerQueue.push(user);
                break;
            case 'bike':
                station.Petrol.bikeQueue.push(user);
            default:
                break;
        }
    }
//save the modified station details
    try {
        station.save()
            .then((res) => {
                console.log('user added to queue successfully');
                response.status(200).json({
                    success: true,
                    message: "user added to correct queue successfully",
                    updatedStation: station,
                })
        })
    }
    catch (err) {
        console.log(err, "couldn't add user to the fuel queue")
    }
}
//method: exit after fueling(update totalAvailableFuelQuantity)
const exitAfterFueling = async (req, response) => {

}

const all = {
    getFuelStationDetails,
    getDetailsOfSearchedFuelStation,
    updateFuelStationDetails,
    addUserToFuelQueue,
    getFuelQueueLengths,
    getQueueWaitingTimes,
    getFuelAvailability,
}

module.exports = all;