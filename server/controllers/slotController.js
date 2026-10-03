const Slot = require('../models/Slot');
const { isFallback, store } = require('../config/db');

const parseTimeValue = (value) => {
  if (!value) return 0;
  const [time, period] = value.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let total = hours * 60 + minutes;
  if (period === 'PM' && hours !== 12) total += 12 * 60;
  if (period === 'AM' && hours === 12) total -= 12 * 60;
  return total;
};

const defaultSlots = [
  { _id: 'slot_1', category: 'Morning', date: new Date().toISOString().split('T')[0], startTime: '7:30 AM', endTime: '10:30 AM', capacity: 25, bookedCount: 0, isActive: true },
  { _id: 'slot_2', category: 'Afternoon', date: new Date().toISOString().split('T')[0], startTime: '12:00 PM', endTime: '4:00 PM', capacity: 30, bookedCount: 0, isActive: true },
  { _id: 'slot_3', category: 'Evening', date: new Date().toISOString().split('T')[0], startTime: '4:00 PM', endTime: '8:00 PM', capacity: 25, bookedCount: 0, isActive: true }
];

if (isFallback() && store.slots.length === 0) {
  store.slots = [...defaultSlots];
}

const getSlots = async (req, res) => {
  try {
    if (isFallback()) {
      const normalized = [...store.slots].map(slot => ({
        ...slot,
        category: ['Morning', 'Afternoon', 'Evening'].includes(slot.category) ? slot.category : 'Morning'
      })).sort((a, b) => parseTimeValue(a.startTime) - parseTimeValue(b.startTime));
      return res.json({ success: true, count: normalized.length, data: normalized });
    }

    const slots = await Slot.find().sort({ startTime: 1 });
    const normalized = [...slots].sort((a, b) => parseTimeValue(a.startTime) - parseTimeValue(b.startTime));
    res.json({ success: true, count: normalized.length, data: normalized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSlot = async (req, res) => {
  const { date, startTime, endTime, capacity, isActive, category } = req.body;

  if (!startTime || !endTime || !category) {
    return res.status(400).json({ success: false, message: 'Please provide category, start time and end time' });
  }

  try {
    if (isFallback()) {
      const newSlot = {
        _id: 'slot_' + Date.now(),
        category,
        date: date || new Date().toISOString().split('T')[0],
        startTime,
        endTime,
        capacity: Number(capacity) || 10,
        bookedCount: 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdAt: new Date()
      };
      store.slots.push(newSlot);
      return res.status(201).json({ success: true, message: 'Slot created successfully', data: newSlot });
    }

    const slot = await Slot.create({
      category,
      date: date || new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      capacity: capacity || 10,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ success: true, message: 'Slot created successfully', data: slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSlot = async (req, res) => {
  try {
    if (isFallback()) {
      const index = store.slots.findIndex(s => s._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Slot not found' });
      store.slots[index] = { ...store.slots[index], ...req.body };
      return res.json({ success: true, message: 'Slot updated successfully', data: store.slots[index] });
    }

    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, message: 'Slot updated successfully', data: slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSlot = async (req, res) => {
  try {
    if (isFallback()) {
      store.slots = store.slots.filter(s => s._id !== req.params.id);
      return res.json({ success: true, message: 'Slot deleted successfully' });
    }

    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSlots,
  createSlot,
  updateSlot,
  deleteSlot,
  defaultSlots
};
