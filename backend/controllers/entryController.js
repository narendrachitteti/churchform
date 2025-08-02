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

    // Generate entryId (CUSTxxxx series)
    const lastEntry = await Entry.findOne({}, {}, { sort: { createdAt: -1 } });
    let nextId = 1;
    if (lastEntry && lastEntry.entryId) {
      const match = lastEntry.entryId.match(/CUST(\d+)/);
      if (match) nextId = parseInt(match[1], 10) + 1;
    }
    const entryId = `CUST${String(nextId).padStart(4, '0')}`;

    const entry = new Entry({
      entryId,
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
