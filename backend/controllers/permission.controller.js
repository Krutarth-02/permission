const notificationSchema = require('../models/nortify.model.js');

module.exports = async function nortifyController(req, res) {
  try {
    const newData = req.body;

    let settings = await notificationSchema.findOne();

    if (!settings) {
      settings = await notificationSchema.create(newData);
    } else {
      Object.assign(settings, newData);
      settings = await settings.save(); 
    }

    res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
