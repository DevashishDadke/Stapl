import Activity from "../models/Activity.js";


export const logActivity = async (req, res) => {
  try {
    const userId = req.user; 

    const activity = new Activity({
      userId,
      category: req.body.category,
      metric: req.body.metric,
      value: req.body.value,
      duration: req.body.duration,
      date: req.body.date || new Date()
    });

    await activity.save();

    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getActivities = async (req, res) => {
  try {
    const userId = req.user;
    const { date, category, metric } = req.query;

    const filter = { userId };

    if (date) filter.date = { $gte: new Date(date) };
    if (category) filter.category = category;
    if (metric) filter.metric = metric;

    const activities = await Activity.find(filter).sort({ date: -1 });

    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getInsights = async (req, res) => {
  try {
    const userId = req.user;
    const { from, to } = req.query;

    const filter = { userId };

    if (from && to) {
      filter.date = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }

    const activities = await Activity.find(filter);

    let totalTime = 0;
    let categoryMap = {};
    let metricMax = {};
    let metricMin = {};

    activities.forEach(a => {
      totalTime += a.duration || 0;

      categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;

      
      if (a.metric) {
        metricMax[a.metric] = Math.max(metricMax[a.metric] || 0, a.value);
        metricMin[a.metric] = Math.min(metricMin[a.metric] || a.value, a.value);
      }
    });

    
    const topCategory = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || null;

    res.json({
      success: true,
      insights: {
        totalTime,
        topCategory,
        metricMax,
        metricMin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConsistencyScore = async (req, res) => {
  try {
    const userId = req.user;

    const today = new Date();
    const last30 = new Date();
    last30.setDate(today.getDate() - 30);

    // Fetch activities from last 30 days
    const activities = await Activity.find({
      userId,
      date: { $gte: last30, $lte: today }
    });

    if (!activities.length) {
      return res.json({
        success: true,
        consistency: {}
      });
    }

    // Track days the user performed each category
    const categoryDays = {};

    activities.forEach(a => {
      const dateKey = new Date(a.date).toDateString();
      categoryDays[a.category] = categoryDays[a.category] || new Set();
      categoryDays[a.category].add(dateKey);
    });

    // Calculate consistency score
    const consistency = {};
    Object.keys(categoryDays).forEach(category => {
      const activeDays = categoryDays[category].size;
      const score = ((activeDays / 30) * 100).toFixed(2);
      consistency[category] = Number(score);
    });

    res.json({ success: true, consistency });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
