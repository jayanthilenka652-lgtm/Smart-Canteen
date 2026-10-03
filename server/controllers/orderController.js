const mongoose = require('mongoose');
const Order = require('../models/Order');
const Slot = require('../models/Slot');
const Food = require('../models/Food');
const Combo = require('../models/Combo');
const { createNotification } = require('./notificationController');
const { isFallback, store } = require('../config/db');

const findOrderByIdentifier = async (identifier) => {
  if (!identifier) return null;
  const value = String(identifier).trim();
  if (!value) return null;

  if (isFallback()) {
    return store.orders.find((order) => order._id === value || order.orderId === value) || null;
  }

  const isValidObjectId = mongoose.isValidObjectId(value);
  return Order.findOne({
    $or: [
      ...(isValidObjectId ? [{ _id: value }] : []),
      { orderId: value }
    ]
  });
};

const getStatusMessage = (status, orderId) => {
  switch (status) {
    case 'Pending':
      return `Order #${orderId} placed successfully.`;
    case 'Accepted':
      return `Your order #${orderId} has been confirmed.`;
    case 'Preparing':
      return `Your order #${orderId} is being prepared.`;
    case 'Ready':
      return `Your order #${orderId} is ready for pickup.`;
    case 'Collected':
      return 'Food collected successfully. Enjoy your meal!';
    case 'Rejected':
      return `Your order #${orderId} could not be processed.`;
    default:
      return `Order #${orderId} updated.`;
  }
};

const getStatusType = (status) => {
  switch (status) {
    case 'Pending':
      return 'order_placed';
    case 'Accepted':
      return 'order_confirmed';
    case 'Preparing':
      return 'order_preparing';
    case 'Ready':
      return 'order_ready';
    case 'Collected':
      return 'order_collected';
    default:
      return 'status_update';
  }
};

const verifyOrderItems = async (items) => {
  const verifiedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const quantity = Number(item.quantity) || 1;

    if (item.comboId) {
      const combo = isFallback()
        ? store.combos.find((candidate) => candidate._id === String(item.comboId))
        : mongoose.isValidObjectId(item.comboId) ? await Combo.findById(item.comboId) : null;
      if (!combo || !combo.isAvailable) return { error: 'This combo is unavailable.' };

      const components = [];
      for (const comboItem of combo.items || []) {
        const food = isFallback()
          ? store.foods.find((candidate) => candidate.name.toLowerCase() === comboItem.name.toLowerCase())
          : await Food.findOne({ name: comboItem.name });
        if (!food || !food.isAvailable) return { error: `Item "${comboItem.name}" in this combo is unavailable.` };
        components.push({ food, quantity: Number(comboItem.quantity) || 1 });
      }
      if (components.length === 0) return { error: 'This combo has no available items.' };

      const regularTotal = components.reduce((sum, component) => sum + component.food.price * component.quantity, 0);
      let allocated = 0;
      components.forEach((component, index) => {
        const lineTotal = index === components.length - 1
          ? Number((combo.price - allocated).toFixed(2))
          : Number((regularTotal ? combo.price * component.food.price * component.quantity / regularTotal : 0).toFixed(2));
        allocated += lineTotal;
        verifiedItems.push({
          food: component.food._id,
          name: component.food.name,
          price: lineTotal / component.quantity,
          quantity: component.quantity * quantity,
          comboName: combo.name
        });
      });
      totalAmount += combo.price * quantity;
      continue;
    }

    const foodId = item.foodId || item.food;
    const food = isFallback()
      ? store.foods.find((candidate) => candidate._id === foodId)
      : mongoose.isValidObjectId(String(foodId)) ? await Food.findById(foodId) : null;
    if (!food) return { error: 'Food item not found.' };
    if (!food.isAvailable) return { error: `Item "${food.name}" is currently unavailable.` };

    verifiedItems.push({ food: food._id, name: food.name, price: food.price, quantity });
    totalAmount += food.price * quantity;
  }

  return { verifiedItems, totalAmount };
};

// @desc    Place a new food order with pickup slot reservation
// @route   POST /api/orders
// @access  Private (Student)
const placeOrder = async (req, res) => {
  const { items, pickupSlotId, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty. Please add food items to checkout.' });
  }

  if (!pickupSlotId) {
    return res.status(400).json({ success: false, message: 'Please select a valid pickup slot.' });
  }

  try {
    const generatedOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    if (isFallback()) {
      // Slot check
      const slot = store.slots.find(s => s._id === pickupSlotId);
      if (!slot) {
        return res.status(400).json({ success: false, message: 'Selected pickup slot does not exist.' });
      }
      if (!slot.isActive) {
        return res.status(400).json({ success: false, message: 'Selected pickup slot is currently inactive.' });
      }
      if (slot.bookedCount >= slot.capacity) {
        return res.status(409).json({ success: false, message: 'Selected pickup slot is FULL. Please choose another time slot.' });
      }

      const orderItems = await verifyOrderItems(items);
      if (orderItems.error) return res.status(400).json({ success: false, message: orderItems.error });
      const { totalAmount, verifiedItems } = orderItems;

      // Reserve slot
      slot.bookedCount += 1;

      const newOrder = {
        _id: 'order_' + Date.now(),
        orderId: generatedOrderId,
        user: req.user._id,
        items: verifiedItems,
        totalAmount,
        pickupSlot: slot._id,
        pickupSlotDetails: {
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime
        },
        paymentMethod: paymentMethod || 'Online',
        paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending',
        orderStatus: 'Pending',
        createdAt: new Date()
      };

      store.orders.unshift(newOrder);
      await createNotification({
        userId: req.user._id,
        orderId: newOrder.orderId,
        order: newOrder,
        type: 'order_placed',
        message: getStatusMessage('Pending', newOrder.orderId)
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        data: newOrder
      });
    }

    // MongoDB Flow
    const slot = await Slot.findById(pickupSlotId);
    if (!slot) {
      return res.status(400).json({ success: false, message: 'Selected pickup slot does not exist.' });
    }
    if (!slot.isActive) {
      return res.status(400).json({ success: false, message: 'Selected pickup slot is inactive.' });
    }
    if (slot.bookedCount >= slot.capacity) {
      return res.status(409).json({ success: false, message: 'Selected pickup slot is FULL. Please choose another slot.' });
    }

    const orderItems = await verifyOrderItems(items);
    if (orderItems.error) return res.status(400).json({ success: false, message: orderItems.error });
    const { totalAmount, verifiedItems } = orderItems;

    // Atomic increment slot bookedCount
    const updatedSlot = await Slot.findOneAndUpdate(
      { _id: pickupSlotId, bookedCount: { $lt: slot.capacity } },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(409).json({ success: false, message: 'Selected pickup slot just filled up. Please select another slot.' });
    }

    const order = await Order.create({
      orderId: generatedOrderId,
      user: req.user._id,
      items: verifiedItems,
      totalAmount,
      pickupSlot: slot._id,
      pickupSlotDetails: {
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      },
      paymentMethod: paymentMethod || 'Online',
      paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending',
      orderStatus: 'Pending'
    });

    await createNotification({
      userId: req.user._id,
      orderId: order.orderId,
      order: order,
      type: 'order_placed',
      message: getStatusMessage('Pending', order.orderId)
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Student)
const getMyOrders = async (req, res) => {
  try {
    if (isFallback()) {
      const userOrders = store.orders.filter(o => o.user === req.user._id);
      return res.json({ success: true, count: userOrders.length, data: userOrders });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('pickupSlot');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID or Order ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await findOrderByIdentifier(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (isFallback()) {
      return res.json({ success: true, data: order });
    }

    const populatedOrder = await Order.findOne({ _id: order._id }).populate('user', 'name email phone').populate('pickupSlot');
    if (!populatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  const { status } = req.query;

  try {
    if (isFallback()) {
      let list = [...store.orders];
      if (status && status !== 'All') {
        list = list.filter(o => o.orderStatus === status);
      }
      return res.json({ success: true, count: list.length, data: list });
    }

    let filter = {};
    if (status && status !== 'All') filter.orderStatus = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('user', 'name email phone').populate('pickupSlot');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status pipeline (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const validStatuses = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Rejected'];

  if (orderStatus && !validStatuses.includes(orderStatus)) {
    return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${validStatuses.join(', ')}` });
  }

  try {
    if (isFallback()) {
      const order = await findOrderByIdentifier(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      const prevStatus = order.orderStatus;
      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;

      if (orderStatus === 'Collected' && order.paymentMethod === 'Cash') {
        order.paymentStatus = 'Paid';
      }

      if (orderStatus && prevStatus !== orderStatus) {
        await createNotification({
          userId: order.user,
          orderId: order.orderId,
          order: { _id: order._id, orderId: order.orderId },
          type: getStatusType(orderStatus),
          message: getStatusMessage(orderStatus, order.orderId)
        });
      }

      if (orderStatus === 'Rejected' && prevStatus !== 'Rejected') {
        const slot = store.slots.find(s => s._id === order.pickupSlot);
        if (slot && slot.bookedCount > 0) {
          slot.bookedCount -= 1;
        }
      }

      return res.json({ success: true, message: `Order status updated to ${order.orderStatus}`, data: order });
    }

    const order = await findOrderByIdentifier(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const prevStatus = order.orderStatus;
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    if (orderStatus === 'Collected' && order.paymentMethod === 'Cash') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    if (orderStatus && prevStatus !== orderStatus) {
      await createNotification({
        userId: order.user,
        orderId: order.orderId,
        order: order,
        type: getStatusType(orderStatus),
        message: getStatusMessage(orderStatus, order.orderId)
      });
    }

    if (orderStatus === 'Rejected' && prevStatus !== 'Rejected') {
      await Slot.findByIdAndUpdate(order.pickupSlot, { $inc: { bookedCount: -1 } });
    }

    res.json({ success: true, message: `Order status updated to ${order.orderStatus}`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
