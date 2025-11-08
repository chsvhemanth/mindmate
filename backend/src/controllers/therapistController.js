import Therapist from '../models/Therapist.js';

// Create a new therapist
export const createTherapist = async (req, res) => {
  try {
    const therapistData = req.body;

    const therapist = new Therapist(therapistData);
    await therapist.save();

    res.status(201).json({
      success: true,
      data: therapist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all therapists
export const getAllTherapists = async (req, res) => {
  try {
    const { city, specialization, limit = 50, skip = 0 } = req.query;

    const query = { isAvailable: true };

    if (city) {
      query['location.city'] = new RegExp(city, 'i'); // Case-insensitive search
    }

    if (specialization) {
      query.specialization = specialization;
    }

    const therapists = await Therapist.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ rating: -1, reviewCount: -1 });

    res.status(200).json({
      success: true,
      data: therapists,
      count: therapists.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Find nearby therapists
export const findNearbyTherapists = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50, specialization, limit = 20 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const maxDist = parseFloat(maxDistance) || 50;
    const limitNum = parseInt(limit) || 20;

    // Geospatial query to find therapists within maxDistance (in km)
    const query = {
      isAvailable: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat] // MongoDB uses [longitude, latitude]
          },
          $maxDistance: maxDist * 1000 // Convert km to meters
        }
      }
    };

    // Note: For the query to work, coordinates must be stored as GeoJSON Point format:
    // { type: 'Point', coordinates: [longitude, latitude] }

    if (specialization) {
      query.specialization = specialization;
    }

    const therapists = await Therapist.find(query)
      .limit(limitNum)
      .sort({ rating: -1, reviewCount: -1 });

    // Calculate distance for each therapist
    const therapistsWithDistance = therapists.map(therapist => {
      const therapistObj = therapist.toObject();
      therapistObj.distance = therapist.calculateDistance(lat, lon);
      return therapistObj;
    });

    // Sort by distance
    therapistsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      data: therapistsWithDistance,
      count: therapistsWithDistance.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single therapist
export const getTherapist = async (req, res) => {
  try {
    const { therapistId } = req.params;

    const therapist = await Therapist.findById(therapistId);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    res.status(200).json({
      success: true,
      data: therapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a therapist
export const updateTherapist = async (req, res) => {
  try {
    const { therapistId } = req.params;
    const updates = req.body;

    const therapist = await Therapist.findByIdAndUpdate(
      therapistId,
      updates,
      { new: true, runValidators: true }
    );

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    res.status(200).json({
      success: true,
      data: therapist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a therapist
export const deleteTherapist = async (req, res) => {
  try {
    const { therapistId } = req.params;

    const therapist = await Therapist.findByIdAndDelete(therapistId);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Therapist deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

