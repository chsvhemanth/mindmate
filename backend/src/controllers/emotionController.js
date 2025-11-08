import Emotion from '../models/Emotion.js';

// Record a new emotion
export const recordEmotion = async (req, res) => {
  try {
    const { userId, emotion, intensity, notes, context } = req.body;

    const emotionRecord = new Emotion({
      userId,
      emotion,
      intensity: intensity || 5,
      notes,
      context,
      date: new Date()
    });

    await emotionRecord.save();

    res.status(201).json({
      success: true,
      data: emotionRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get emotion history for a user
export const getEmotionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    let query = { userId };

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const emotions = await Emotion.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: emotions.length,
      data: emotions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get emotion statistics for a user
export const getEmotionStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const emotions = await Emotion.find({
      userId,
      date: { $gte: startDate }
    });

    // Calculate statistics
    const stats = {
      total: emotions.length,
      byEmotion: {},
      averageIntensity: 0,
      dailyAverage: {}
    };

    let totalIntensity = 0;

    emotions.forEach(emotion => {
      // Count by emotion type
      stats.byEmotion[emotion.emotion] = (stats.byEmotion[emotion.emotion] || 0) + 1;
      
      // Sum intensity
      totalIntensity += emotion.intensity;

      // Group by date
      const dateKey = emotion.date.toISOString().split('T')[0];
      if (!stats.dailyAverage[dateKey]) {
        stats.dailyAverage[dateKey] = {
          count: 0,
          totalIntensity: 0
        };
      }
      stats.dailyAverage[dateKey].count++;
      stats.dailyAverage[dateKey].totalIntensity += emotion.intensity;
    });

    // Calculate average intensity
    stats.averageIntensity = emotions.length > 0 
      ? (totalIntensity / emotions.length).toFixed(2) 
      : 0;

    // Calculate daily averages
    Object.keys(stats.dailyAverage).forEach(date => {
      const daily = stats.dailyAverage[date];
      daily.averageIntensity = (daily.totalIntensity / daily.count).toFixed(2);
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete an emotion record
export const deleteEmotion = async (req, res) => {
  try {
    const { emotionId } = req.params;

    const emotion = await Emotion.findByIdAndDelete(emotionId);

    if (!emotion) {
      return res.status(404).json({
        success: false,
        message: 'Emotion record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Emotion record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

