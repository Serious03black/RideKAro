const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const feedbackModel = require('../models/feedback.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 1000);

        if (captainsInRadius.length === 0) {
            return;
        }

        ride.otp = "";

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });

    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message });
        }
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getCaptainHistory = async (req, res) => {
    try {
        const captainId = req.captain._id;
        const rides = await rideModel.find({ captain: captainId }).populate('user', 'fullname email').sort({ createdAt: -1 });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        let todayEarnings = 0;
        let todayRidesCount = 0;
        let monthlyEarnings = 0;
        let monthlyRidesCount = 0;

        rides.forEach(ride => {
            const rideDate = ride.createdAt || new Date();
            if (rideDate >= todayStart) {
                todayEarnings += (ride.fare || 0);
                todayRidesCount += 1;
            }
            if (rideDate >= monthStart) {
                monthlyEarnings += (ride.fare || 0);
                monthlyRidesCount += 1;
            }
        });

        res.status(200).json({
            todayEarnings,
            todayRidesCount,
            monthlyEarnings,
            monthlyRidesCount,
            totalRidesCount: rides.length,
            rides
        });
    } catch (err) {
        console.error('Error fetching captain history:', err);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};

module.exports.getUserHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const rides = await rideModel.find({ user: userId }).populate('captain', 'fullname vehicle').sort({ createdAt: -1 });
        res.status(200).json({ rides });
    } catch (err) {
        console.error('Error fetching user history:', err);
        res.status(500).json({ message: 'Failed to fetch user history' });
    }
};

module.exports.submitFeedback = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, feedback, rating } = req.body;

    try {
        const ride = await rideModel.findById(rideId).populate('user').populate('captain');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        const newFeedback = new feedbackModel({
            ride: ride._id,
            user: ride.user._id,
            captain: ride.captain._id,
            feedback,
            rating,
        });

        await newFeedback.save();

        res.status(200).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
};