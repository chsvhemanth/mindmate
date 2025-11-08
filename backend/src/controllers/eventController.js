import Event from '../models/Event.js';
import User from '../models/User.js';

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      city,
      date,
      time,
      maxAttendees,
      category,
      requiresApproval
    } = req.body;

    const hostId = req.user?.userId || req.body.hostId;

    if (!hostId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify host exists
    const host = await User.findById(hostId);
    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host user not found'
      });
    }

    const event = new Event({
      title,
      description,
      location,
      city,
      date: new Date(date),
      time,
      maxAttendees,
      category,
      hostId,
      requiresApproval: requiresApproval || false
    });

    await event.save();

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const { city, category, date, limit = 50, skip = 0 } = req.query;

    const query = {};

    if (city && city !== 'all') {
      query.city = city;
    }

    if (category) {
      query.category = category;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    } else {
      // Only show future events by default
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('hostId', 'firstName lastName email')
      .populate('participants.userId', 'firstName lastName')
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Add virtual attendees count
    const eventsWithAttendees = events.map(event => {
      const eventObj = event.toObject();
      eventObj.attendees = event.attendees;
      eventObj.pendingRequests = event.pendingRequests;
      return eventObj;
    });

    res.status(200).json({
      success: true,
      data: eventsWithAttendees,
      count: eventsWithAttendees.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single event
export const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate('hostId', 'firstName lastName email')
      .populate('participants.userId', 'firstName lastName email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const eventObj = event.toObject();
    eventObj.attendees = event.attendees;
    eventObj.pendingRequests = event.pendingRequests;

    res.status(200).json({
      success: true,
      data: eventObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Join an event (request to join)
export const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.userId || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.isFull()) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    if (event.hasParticipant(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a participant'
      });
    }

    // Add participant (auto-approve if approval not required)
    event.addParticipant(userId, !event.requiresApproval);

    await event.save();

    const eventObj = event.toObject();
    eventObj.attendees = event.attendees;

    res.status(200).json({
      success: true,
      data: eventObj,
      message: event.requiresApproval 
        ? 'Join request submitted. Waiting for approval.'
        : 'Successfully joined the event!'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Approve a join request (host only)
export const approveJoinRequest = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const hostId = req.user?.userId || req.body.hostId;

    if (!hostId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.hostId.toString() !== hostId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the event host can approve requests'
      });
    }

    event.approveParticipant(userId);
    await event.save();

    const eventObj = event.toObject();
    eventObj.attendees = event.attendees;

    res.status(200).json({
      success: true,
      data: eventObj,
      message: 'Join request approved'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Reject a join request (host only)
export const rejectJoinRequest = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const hostId = req.user?.userId || req.body.hostId;

    if (!hostId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.hostId.toString() !== hostId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the event host can reject requests'
      });
    }

    event.rejectParticipant(userId);
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
      message: 'Join request rejected'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get events for a specific user
export const getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    const events = await Event.find({
      $or: [
        { hostId: userId },
        { 'participants.userId': userId }
      ]
    })
      .populate('hostId', 'firstName lastName email')
      .sort({ date: 1 });

    const eventsWithAttendees = events.map(event => {
      const eventObj = event.toObject();
      eventObj.attendees = event.attendees;
      
      // Check user's participation status
      const participant = event.participants.find(
        p => p.userId.toString() === userId
      );
      eventObj.userStatus = participant ? participant.status : null;
      eventObj.isHost = event.hostId._id.toString() === userId;

      return eventObj;
    });

    res.status(200).json({
      success: true,
      data: eventsWithAttendees,
      count: eventsWithAttendees.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update an event (host only)
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const hostId = req.user?.userId || req.body.hostId;
    const updates = req.body;

    if (!hostId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.hostId.toString() !== hostId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the event host can update the event'
      });
    }

    // Don't allow updating participants through this endpoint
    delete updates.participants;
    delete updates.hostId;

    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    Object.assign(event, updates);
    await event.save();

    const eventObj = event.toObject();
    eventObj.attendees = event.attendees;

    res.status(200).json({
      success: true,
      data: eventObj
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete an event (host only)
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const hostId = req.user?.userId || req.body.hostId;

    if (!hostId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.hostId.toString() !== hostId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the event host can delete the event'
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

