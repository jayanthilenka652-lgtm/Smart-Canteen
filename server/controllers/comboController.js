const Combo = require('../models/Combo');
const { isFallback, store } = require('../config/db');

const defaultCombos = [
  {
    name: 'Breakfast Combo',
    description: 'Idly + Vada + Tea',
    items: [
      { name: 'Idly', quantity: 1 },
      { name: 'Vada', quantity: 1 },
      { name: 'Tea', quantity: 1 }
    ],
    price: 70,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800',
    isAvailable: true
  },
  {
    name: 'Snack Combo',
    description: 'Samosa + Tea',
    items: [
      { name: 'Samosa', quantity: 1 },
      { name: 'Tea', quantity: 1 }
    ],
    price: 40,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    isAvailable: true
  },
  {
    name: 'Student Meal Combo',
    description: 'Veg Fried Rice + Drink',
    items: [
      { name: 'Veg Fried Rice', quantity: 1 },
      { name: 'Buttermilk', quantity: 1 }
    ],
    price: 110,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
    isAvailable: true
  },
  {
    name: 'Dosa Combo',
    description: 'Masala Dosa + Filter Coffee',
    items: [
      { name: 'Masala Dosa', quantity: 1 },
      { name: 'Filter Coffee', quantity: 1 }
    ],
    price: 75,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800',
    isAvailable: true
  }
];

const seedDefaultCombos = async () => {
  try {
    if (isFallback()) {
      const normalized = defaultCombos.map((combo, index) => ({
        _id: 'combo_' + (index + 1),
        ...combo,
        createdAt: new Date()
      }));
      store.combos = normalized;
      return;
    }

    for (const combo of defaultCombos) {
      await Combo.updateOne({ name: combo.name }, { $setOnInsert: combo }, { upsert: true, runValidators: true });
    }
  } catch (error) {
    console.error('[Seed Error]: Failed to seed default combos:', error.message);
  }
};

const getCombos = async (req, res) => {
  try {
    if (isFallback()) {
      const list = [...store.combos];
      return res.json({ success: true, count: list.length, data: list });
    }

    const combos = await Combo.find().sort({ createdAt: -1 });
    res.json({ success: true, count: combos.length, data: combos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCombo = async (req, res) => {
  const { name, description, items, price, image, isAvailable } = req.body;

  if (!name || !price || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Combo name, price, and included items are required' });
  }

  try {
    if (isFallback()) {
      const combo = {
        _id: 'combo_' + Date.now(),
        name,
        description: description || '',
        items,
        price: Number(price),
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        createdAt: new Date()
      };
      store.combos.unshift(combo);
      return res.status(201).json({ success: true, message: 'Combo created successfully', data: combo });
    }

    const combo = await Combo.create({
      name,
      description: description || '',
      items,
      price: Number(price),
      image: image || undefined,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
    });

    res.status(201).json({ success: true, message: 'Combo created successfully', data: combo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCombo = async (req, res) => {
  try {
    if (isFallback()) {
      const index = store.combos.findIndex((combo) => combo._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Combo not found' });
      store.combos[index] = { ...store.combos[index], ...req.body };
      return res.json({ success: true, message: 'Combo updated successfully', data: store.combos[index] });
    }

    const combo = await Combo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });
    res.json({ success: true, message: 'Combo updated successfully', data: combo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleComboAvailability = async (req, res) => {
  try {
    if (isFallback()) {
      const combo = store.combos.find((item) => item._id === req.params.id);
      if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });
      combo.isAvailable = !combo.isAvailable;
      return res.json({ success: true, message: `Combo availability updated`, data: combo });
    }

    const combo = await Combo.findById(req.params.id);
    if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });
    combo.isAvailable = !combo.isAvailable;
    await combo.save();
    res.json({ success: true, message: 'Combo availability updated', data: combo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCombo = async (req, res) => {
  try {
    if (isFallback()) {
      const before = store.combos.length;
      store.combos = store.combos.filter((combo) => combo._id !== req.params.id);
      if (before === store.combos.length) return res.status(404).json({ success: false, message: 'Combo not found' });
      return res.json({ success: true, message: 'Combo deleted successfully' });
    }

    const combo = await Combo.findByIdAndDelete(req.params.id);
    if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });
    res.json({ success: true, message: 'Combo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  defaultCombos,
  seedDefaultCombos,
  getCombos,
  createCombo,
  updateCombo,
  toggleComboAvailability,
  deleteCombo
};
