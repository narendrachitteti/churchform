const Entry = require('../models/Entry');

exports.getEntries = async (req, res) => {
  try {
    const entries = await Entry.find().populate('user').populate('form');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEntry = async (req, res) => {
  try {
    const { form, data, familyMembers, user } = req.body;
    const entry = new Entry({
      form: form || null,
      user: user || null,
      data,
      familyMembers,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
