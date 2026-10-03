const Food = require('../models/Food');
const { isFallback, store } = require('../config/db');

const defaultFoods = [
  {
    name: 'Upma',
    category: 'Breakfast',
    description: 'Soft semolina cooked with veggies and tempering.',
    price: 30,
    image: '/foods/upma.png',
    isAvailable: false,
    preparationTime: '8 mins',
    rating: 4.4
  },
  {
    name: 'Masala Dosa',
    category: 'Breakfast',
    description: 'Crispy dosa filled with spiced potato masala.',
    price: 50,
    image: '/foods/masala-dosa.png',
    isAvailable: true,
    preparationTime: '10 mins',
    rating: 4.8
  },
  {
    name: 'Plain Dosa',
    category: 'Breakfast',
    description: 'Golden, crisp plain dosa served hot.',
    price: 40,
    image: '/foods/plain-dosa.png',
    isAvailable: true,
    preparationTime: '8 mins',
    rating: 4.6
  },
  {
    name: 'Vada',
    category: 'Breakfast',
    description: 'Crispy fried dal vada served with chutney.',
    price: 25,
    image: '/foods/vada.png',
    isAvailable: true,
    preparationTime: '5 mins',
    rating: 4.5
  },
  {
    name: 'Poori',
    category: 'Breakfast',
    description: 'Puffed poori served with spicy potato masala.',
    price: 40,
    image: '/foods/poori.png',
    isAvailable: true,
    preparationTime: '8 mins',
    rating: 4.5
  },
  {
    name: 'Idly',
    category: 'Breakfast',
    description: 'Soft idly served with sambar and chutney.',
    price: 30,
    image: '/foods/idly.png',
    isAvailable: true,
    preparationTime: '6 mins',
    rating: 4.7
  },
  {
    name: 'Punukulu',
    category: 'Breakfast',
    description: 'Crunchy fried punukulu with a savory taste.',
    price: 30,
    image: '/foods/punukulu.png',
    isAvailable: true,
    preparationTime: '5 mins',
    rating: 4.3
  },
  {
    name: 'Chapathi',
    category: 'Breakfast',
    description: 'Freshly made chapathi with curry and chutney.',
    price: 30,
    image: '/foods/chapathi.png',
    isAvailable: true,
    preparationTime: '7 mins',
    rating: 4.4
  },
  {
    name: 'Veg Fried Rice',
    category: 'Lunch',
    description: 'Wok-tossed rice with veggies and soy flavor.',
    price: 90,
    image: '/foods/veg-fried-rice.png',
    isAvailable: true,
    preparationTime: '12 mins',
    rating: 4.6
  },
  {
    name: 'Chicken Biryani',
    category: 'Lunch',
    description: 'Aromatic chicken biryani with rich spices.',
    price: 120,
    image: '/foods/chicken-biryani.png',
    isAvailable: false,
    preparationTime: '15 mins',
    rating: 4.9
  },
  {
    name: 'Egg Fried Rice',
    category: 'Lunch',
    description: 'Fried rice with egg, veggies and savory seasoning.',
    price: 80,
    image: '/foods/egg-fried-rice.png',
    isAvailable: true,
    preparationTime: '12 mins',
    rating: 4.5
  },
  {
    name: 'Veg Meals',
    category: 'Lunch',
    description: 'Traditional veg thali with rice, sambar and sides.',
    price: 80,
    image: '/foods/veg-meals.png',
    isAvailable: true,
    preparationTime: '10 mins',
    rating: 4.7
  },
  {
    name: 'Veg Biryani',
    category: 'Lunch',
    description: 'Flavorful veg biryani with long-grain rice.',
    price: 90,
    image: '/foods/veg-biryani.png',
    isAvailable: true,
    preparationTime: '15 mins',
    rating: 4.8
  },
  {
    name: 'Chicken Fried Rice',
    category: 'Lunch',
    description: 'Chicken fried rice with egg and spring onions.',
    price: 100,
    image: '/foods/chicken-fried-rice.png',
    isAvailable: true,
    preparationTime: '12 mins',
    rating: 4.7
  },
  {
    name: 'Egg Noodles',
    category: 'Lunch',
    description: 'Savory noodles tossed with egg and vegetables.',
    price: 80,
    image: '/foods/noodles.jpg',
    isAvailable: true,
    preparationTime: '12 mins',
    rating: 4.5
  },
  {
    name: 'Noodles',
    category: 'Lunch',
    description: 'Hot stir-fried noodles with fresh vegetables and seasoning.',
    price: 70,
    image: '/foods/noodles.jpg',
    isAvailable: true,
    preparationTime: '10 mins',
    rating: 4.5
  },
  {
    name: 'Maggi',
    category: 'Snacks',
    description: 'Hot masala noodles served fresh.',
    price: 30,
    image: '/foods/maggie.jpg',
    isAvailable: true,
    preparationTime: '6 mins',
    rating: 4.5
  },
  {
    name: 'Maggie',
    category: 'Snacks',
    description: 'Hot instant noodles tossed with a mild masala seasoning.',
    price: 30,
    image: '/foods/maggie.jpg',
    isAvailable: true,
    preparationTime: '6 mins',
    rating: 4.5
  },
  {
    name: 'Mirchi Bajji',
    category: 'Snacks',
    description: 'Spicy green chili fritters served hot.',
    price: 30,
    image: '/foods/mirchi-bajji.png',
    isAvailable: true,
    preparationTime: '8 mins',
    rating: 4.6
  },
  {
    name: 'Samosa',
    category: 'Snacks',
    description: 'Crispy pastry with spicy potato filling.',
    price: 20,
    image: '/foods/samosa.png',
    isAvailable: true,
    preparationTime: '5 mins',
    rating: 4.8
  },
  {
    name: 'Pav Bhaji',
    category: 'Snacks',
    description: 'Butter pav with spicy mashed vegetable curry.',
    price: 60,
    image: '/foods/pav-bhaji.png',
    isAvailable: true,
    preparationTime: '12 mins',
    rating: 4.9
  },
  {
    name: 'Veg Sandwich',
    category: 'Snacks',
    description: 'Fresh veg sandwich with crunchy salad filling.',
    price: 60,
    image: '/foods/veg-sandwich.png',
    isAvailable: true,
    preparationTime: '10 mins',
    rating: 4.5
  },
  {
    name: 'Veg Puffs',
    category: 'Snacks',
    description: 'Flaky puff pastry stuffed with savory veg mix.',
    price: 35,
    image: '/foods/veg-puffs.png',
    isAvailable: true,
    preparationTime: '5 mins',
    rating: 4.4
  },
  {
    name: 'Egg Puffs',
    category: 'Snacks',
    description: 'Flaky baked pastry filled with spiced boiled egg.',
    price: 35,
    image: '/foods/egg-puffs.png',
    isAvailable: true,
    preparationTime: '5 mins',
    rating: 4.4
  },
  {
    name: 'French Fries',
    category: 'Snacks',
    description: 'Golden crunchy fries with a salted finish.',
    price: 50,
    image: '/foods/french-fries.png',
    isAvailable: true,
    preparationTime: '8 mins',
    rating: 4.5
  },
  {
    name: 'Chips',
    category: 'Snacks',
    description: 'Crisp potato chips for a quick bite.',
    price: 20,
    image: '/foods/chips.png',
    isAvailable: true,
    preparationTime: '2 mins',
    rating: 4.2
  },
  {
    name: 'Sprite',
    category: 'Drinks',
    description: 'Chilled lemon-lime soft drink.',
    price: 35,
    image: '/foods/sprite.png',
    isAvailable: true,
    preparationTime: '1 min',
    rating: 4.4
  },
  {
    name: 'Coke',
    category: 'Drinks',
    description: 'Classic chilled cola soft drink.',
    price: 35,
    image: '/foods/coke.png',
    isAvailable: true,
    preparationTime: '1 min',
    rating: 4.3
  },
  {
    name: 'Maaza',
    category: 'Drinks',
    description: 'Refreshing mango drink served cold.',
    price: 35,
    image: '/foods/maaza.png',
    isAvailable: true,
    preparationTime: '1 min',
    rating: 4.5
  },
  {
    name: 'Fanta',
    category: 'Drinks',
    description: 'Orange soda with a sweet citrus taste.',
    price: 35,
    image: '/foods/fanta.png',
    isAvailable: true,
    preparationTime: '1 min',
    rating: 4.2
  },
  {
    name: 'Buttermilk',
    category: 'Drinks',
    description: 'Cool spiced buttermilk with a refreshing taste.',
    price: 25,
    image: '/foods/buttermilk.png',
    isAvailable: true,
    preparationTime: '3 mins',
    rating: 4.7
  },
  {
    name: 'Fresh Lime Juice',
    category: 'Drinks',
    description: 'Freshly squeezed lime juice with a tangy bite.',
    price: 40,
    image: '/foods/fresh-lime-juice.png',
    isAvailable: true,
    preparationTime: '4 mins',
    rating: 4.7
  },
  {
    name: 'Water Bottle',
    category: 'Drinks',
    description: 'Clean mineral water bottle for hydration.',
    price: 20,
    image: '/foods/water-bottle.png',
    isAvailable: true,
    preparationTime: '1 min',
    rating: 4.6
  },
  {
    name: 'Tea',
    category: 'Beverages',
    description: 'Freshly brewed hot tea with a rich aroma.',
    price: 15,
    image: '/foods/tea.png',
    isAvailable: true,
    preparationTime: '5 mins',
    rating: 4.9
  },
  {
    name: 'Filter Coffee',
    category: 'Beverages',
    description: 'South Indian filter coffee with a strong finish.',
    price: 25,
    image: '/foods/filter-coffee.png',
    isAvailable: true,
    preparationTime: '5 mins',
    rating: 4.8
  },
  {
    name: 'Coffee',
    category: 'Beverages',
    description: 'Freshly brewed coffee served hot.',
    price: 20,
    image: '/foods/coffee.jpg',
    isAvailable: true,
    preparationTime: '5 mins',
    rating: 4.5
  },
  {
    name: 'Cold Coffee',
    category: 'Beverages',
    description: 'Iced creamy coffee blended to a smooth finish.',
    price: 50,
    image: '/foods/cold-coffee.png',
    isAvailable: true,
    preparationTime: '6 mins',
    rating: 4.8
  }
];

const seedDefaultFoods = async () => {
  try {
    const canonicalNames = defaultFoods.map(item => item.name);

    if (isFallback()) {
      const normalizedFoods = defaultFoods.map((item, idx) => ({
        _id: 'food_' + (idx + 1),
        ...item,
        createdAt: new Date()
      }));

      store.foods = normalizedFoods.filter(item => canonicalNames.includes(item.name));
      console.log(`[Seed]: Verified fallback catalog with ${store.foods.length} menu items.`);
      return;
    }

    for (const item of defaultFoods) {
      const { image, isAvailable, ...insertFields } = item;
      await Food.updateOne(
        { name: item.name },
        {
          $set: { image, isAvailable },
          $setOnInsert: insertFields
        },
        { upsert: true, runValidators: true }
      );
    }

    await Food.updateMany(
      { name: { $nin: ['Upma', 'Chicken Biryani'] }, isAvailable: false },
      { $set: { isAvailable: true } }
    );

    const totalCount = await Food.countDocuments();
    console.log(`[Seed]: Verified MongoDB catalog (${totalCount} items).`);
  } catch (error) {
    console.error(`[Seed Error]: Failed to seed default foods: ${error.message}`);
  }
};

const getFoods = async (req, res) => {
  const { category, search, availableOnly } = req.query;

  try {
    if (isFallback()) {
      let result = [...store.foods];
      if (category && category !== 'All') {
        result = result.filter(f => f.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(f => f.name.toLowerCase().includes(q) || (f.description && f.description.toLowerCase().includes(q)));
      }
      if (availableOnly === 'true') {
        result = result.filter(f => f.isAvailable);
      }
      return res.json({ success: true, count: result.length, data: result });
    }

    let filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (availableOnly === 'true') filter.isAvailable = true;

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: foods.length, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFoodById = async (req, res) => {
  try {
    if (isFallback()) {
      const food = store.foods.find(f => f._id === req.params.id);
      if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });
      return res.json({ success: true, data: food });
    }

    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFood = async (req, res) => {
  const { name, description, price, category, image, isAvailable, preparationTime, rating } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({ success: false, message: 'Please provide food name, price, and category' });
  }

  try {
    if (isFallback()) {
      const newFood = {
        _id: 'food_' + Date.now(),
        name,
        description: description || '',
        price: Number(price),
        category,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        preparationTime: preparationTime || '10 mins',
        rating: Number(rating) || 4.5,
        createdAt: new Date()
      };
      store.foods.unshift(newFood);
      return res.status(201).json({ success: true, message: 'Food created successfully', data: newFood });
    }

    const food = await Food.create({
      name,
      description: description || '',
      price: Number(price),
      category,
      image: image || undefined,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      preparationTime: preparationTime || '10 mins',
      rating: Number(rating) || 4.5
    });

    res.status(201).json({ success: true, message: 'Food created successfully', data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFood = async (req, res) => {
  try {
    if (isFallback()) {
      const index = store.foods.findIndex(f => f._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Food item not found' });
      store.foods[index] = { ...store.foods[index], ...req.body };
      return res.json({ success: true, message: 'Food updated successfully', data: store.foods[index] });
    }

    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });
    res.json({ success: true, message: 'Food updated successfully', data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    if (isFallback()) {
      const food = store.foods.find(f => f._id === req.params.id);
      if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });
      food.isAvailable = !food.isAvailable;
      return res.json({ success: true, message: `Availability toggled to ${food.isAvailable}`, data: food });
    }

    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });
    food.isAvailable = !food.isAvailable;
    await food.save();
    res.json({ success: true, message: `Availability toggled to ${food.isAvailable}`, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    if (isFallback()) {
      store.foods = store.foods.filter(f => f._id !== req.params.id);
      return res.json({ success: true, message: 'Food item deleted successfully' });
    }

    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });
    res.json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  toggleAvailability,
  deleteFood,
  seedDefaultFoods,
  defaultFoods
};
